const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateCertificateHash, createCertificateMetadata, verifyCertificateIntegrity } = require('../utils/cryptoUtils');
const notificationService = require('../services/notificationService');

// Configure multer for certificate uploads
const uploadDir = 'uploads/certificates/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed!'));
        }
    }
}).single('certificate');

const submitCertificate = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'Certificate file is required' });
        
        try {
            const { userId } = req.params;
            const { activityId, category, activityTitle } = req.body;
            
            if (!activityId || !category || !activityTitle) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const student = await User.findOne({ user1Id: userId });
            if (!student) return res.status(404).json({ message: 'Student not found' });
            
            const activity = await Activity.findById(activityId);
            if (!activity) return res.status(404).json({ message: 'Activity not found' });
            
            const filePath = path.join(uploadDir, req.file.filename);
            const certificateHash = generateCertificateHash(filePath);
            
            const certificate = new Certificate({
                activityId: activityId,
                studentId: student.user1Id,
                user1Id: student.user1Id,
                certificateFile: `/uploads/certificates/${req.file.filename}`,
                category: category,
                activityTitle: activityTitle,
                certificateHash: certificateHash,
                status: 'pending',
                submittedAt: new Date()
            });
            
            await certificate.save();
            await notificationService.createCertificateNotification(certificate, activity, student, 'certificate_approval_pending');
            
            res.status(201).json({ message: 'Certificate submitted successfully', certificate: certificate });
        } catch (error) {
            if (req.file) {
                fs.unlink(path.join(uploadDir, req.file.filename), (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

const getPendingCertificates = async (req, res) => {
    try {
        const { facultyId } = req.params;
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        
        const certificates = await Certificate.find({
            category: faculty.facultyInchargeType,
            status: 'pending'
        }).populate('activityId').sort({ submittedAt: -1 });
        
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const approveCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const { facultyId } = req.body;
        
        if (!facultyId) return res.status(400).json({ message: 'Faculty ID is required' });
        
        const certificate = await Certificate.findById(certificateId);
        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        if (certificate.status !== 'pending') return res.status(400).json({ message: 'Only pending certificates can be approved' });
        
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        if (faculty.facultyInchargeType !== certificate.category) return res.status(403).json({ message: 'Faculty role does not match certificate category' });
        
        const student = await User.findOne({ user1Id: certificate.studentId });
        const certMetadata = createCertificateMetadata(certificate.certificateHash, {
            approvedBy: faculty.fullName,
            approverRole: faculty.facultyInchargeType
        });
        
        certificate.status = 'approved';
        certificate.approvedBy = faculty.fullName;
        certificate.approverRole = faculty.facultyInchargeType;
        certificate.approvalDate = new Date();
        certificate.digitalSignature = certMetadata.signature;
        certificate.signatureData = certMetadata.signatureData;
        
        await certificate.save();
        await Activity.findByIdAndUpdate(certificate.activityId, {
            verificationStatus: 'approved',
            certificateId: certificate._id,
            approvedByFaculty: faculty.fullName,
            facultyRole: faculty.facultyInchargeType,
            approvalDate: new Date(),
            certificateSignature: certMetadata.signature,
            certificateHash: certificate.certificateHash
        });
        
        await notificationService.createApprovalNotification(certificate, student, faculty);
        
        res.json({ message: 'Certificate approved successfully', certificate: certificate });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const rejectCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const { facultyId, rejectionReason } = req.body;
        
        if (!facultyId) return res.status(400).json({ message: 'Faculty ID is required' });
        if (!rejectionReason) return res.status(400).json({ message: 'Rejection reason is required' });
        
        const certificate = await Certificate.findById(certificateId);
        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        if (certificate.status !== 'pending') return res.status(400).json({ message: 'Only pending certificates can be rejected' });
        
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        
        const student = await User.findOne({ user1Id: certificate.studentId });
        
        certificate.status = 'rejected';
        certificate.rejectionReason = rejectionReason;
        certificate.approvedBy = faculty.fullName;
        certificate.approverRole = faculty.facultyInchargeType;
        certificate.approvalDate = new Date();
        
        await certificate.save();
        await Activity.findByIdAndUpdate(certificate.activityId, { verificationStatus: 'rejected' });
        await notificationService.createRejectionNotification(certificate, student, faculty, rejectionReason);
        
        res.json({ message: 'Certificate rejected successfully', certificate: certificate });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getStudentCertificates = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.query;
        let query = { studentId: userId };
        if (status) query.status = status;
        const certificates = await Certificate.find(query).populate('activityId').sort({ submittedAt: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const certificate = await Certificate.findById(certificateId);
        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        const verificationResult = verifyCertificateIntegrity({
            hash: certificate.certificateHash,
            signature: certificate.digitalSignature,
            signatureData: certificate.signatureData
        });
        res.json(verificationResult);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCertificateStats = async (req, res) => {
    try {
        const { facultyId } = req.params;
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        
        const stats = await Certificate.aggregate([
            { $match: { category: faculty.facultyInchargeType } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const total = await Certificate.countDocuments({ category: faculty.facultyInchargeType });
        res.json({ total, byStatus: stats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitCertificate,
    getPendingCertificates,
    approveCertificate,
    rejectCertificate,
    getStudentCertificates,
    verifyCertificate,
    getCertificateStats
};
