const Activity = require('../models/Activity');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

// Get all pending verification requests for a faculty based on their category
const getPendingVerifications = async (req, res) => {
    try {
        const { facultyId } = req.params;
        
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Map faculty role to category names
        const categoryMap = {
            'Hackathons': 'hackathons',
            'Sports': 'sports',
            'Workshops': 'workshops',
            'Extracurricular Activity': 'achievements'
        };

        const category = categoryMap[faculty.facultyInchargeType];

        // Find all activities with certificates pending verification for this faculty's category
        const pendingVerifications = await Activity.find({
            category: category,
            verificationStatus: 'pending',
            certificateUrl: { $exists: true, $ne: '' }
        })
            .sort({ createdAt: -1 });

        // Get student details for each activity
        const activitiesWithStudents = await Promise.all(
            pendingVerifications.map(async (activity) => {
                const student = await User.findOne({ user1Id: activity.user1Id });
                return {
                    ...activity.toObject(),
                    studentName: student?.fullName || 'Unknown',
                    studentEmail: student?.email || '',
                    studentId: activity.user1Id
                };
            })
        );

        res.json(activitiesWithStudents);
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Approve an activity verification request
const approveVerification = async (req, res) => {
    try {
        const { activityId } = req.params;
        const { facultyId, approvalNotes } = req.body;

        if (!facultyId) {
            return res.status(400).json({ message: 'Faculty ID is required' });
        }

        // Find and validate faculty
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Find the activity
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Validate that activity has pending verification status
        if (activity.verificationStatus !== 'pending') {
            return res.status(400).json({ message: 'This activity is not pending verification' });
        }

        // Validate that faculty's role matches activity category
        const categoryMap = {
            'Hackathons': 'hackathons',
            'Sports': 'sports',
            'Workshops': 'workshops',
            'Extracurricular Activity': 'achievements'
        };

        if (categoryMap[faculty.facultyInchargeType] !== activity.category) {
            return res.status(403).json({ message: 'Faculty role does not match activity category' });
        }

        // Update activity with approval
        activity.verificationStatus = 'approved';
        activity.approvedByFaculty = faculty.fullName;
        activity.approvedByFacultyId = faculty._id;  // Store faculty MongoDB ObjectId
        activity.approvedByFacultyUser1Id = faculty.user1Id;  // Store faculty user1Id
        activity.facultyRole = faculty.facultyInchargeType;
        activity.approvalDate = new Date();

        await activity.save();

        // Get student for notification
        const student = await User.findOne({ user1Id: activity.user1Id });

        // Create notification
        if (student) {
            await notificationService.createActivityApprovalNotification(
                activity,
                student,
                faculty,
                'approved',
                approvalNotes
            );
        }

        res.json({
            message: 'Activity verification approved successfully',
            activity: activity
        });
    } catch (error) {
        console.error('Error approving verification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reject an activity verification request
const rejectVerification = async (req, res) => {
    try {
        const { activityId } = req.params;
        const { facultyId, rejectionReason } = req.body;

        if (!facultyId) {
            return res.status(400).json({ message: 'Faculty ID is required' });
        }

        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        // Find and validate faculty
        const faculty = await User.findOne({ user1Id: facultyId, role: 'FacultyIncharge' });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Find the activity
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Validate that activity has pending verification status
        if (activity.verificationStatus !== 'pending') {
            return res.status(400).json({ message: 'This activity is not pending verification' });
        }

        // Validate that faculty's role matches activity category
        const categoryMap = {
            'Hackathons': 'hackathons',
            'Sports': 'sports',
            'Workshops': 'workshops',
            'Extracurricular Activity': 'achievements'
        };

        if (categoryMap[faculty.facultyInchargeType] !== activity.category) {
            return res.status(403).json({ message: 'Faculty role does not match activity category' });
        }

        // Update activity with rejection
        activity.verificationStatus = 'rejected';
        activity.approvedByFaculty = faculty.fullName;
        activity.approvedByFacultyId = faculty._id;  // Store faculty MongoDB ObjectId
        activity.approvedByFacultyUser1Id = faculty.user1Id;  // Store faculty user1Id
        activity.facultyRole = faculty.facultyInchargeType;
        activity.approvalDate = new Date();
        activity.rejectionReason = rejectionReason;

        await activity.save();

        // Get student for notification
        const student = await User.findOne({ user1Id: activity.user1Id });

        // Create notification
        if (student) {
            await notificationService.createActivityApprovalNotification(
                activity,
                student,
                faculty,
                'rejected',
                rejectionReason
            );
        }

        res.json({
            message: 'Activity verification rejected successfully',
            activity: activity
        });
    } catch (error) {
        console.error('Error rejecting verification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get verification status for a specific activity
const getVerificationStatus = async (req, res) => {
    try {
        const { activityId } = req.params;

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        const response = {
            _id: activity._id,
            title: activity.title,
            category: activity.category,
            verificationStatus: activity.verificationStatus,
            approvedByFaculty: activity.approvedByFaculty,
            approvedByFacultyId: activity.approvedByFacultyId,
            facultyRole: activity.facultyRole,
            approvalDate: activity.approvalDate,
            rejectionReason: activity.rejectionReason,
            certificateUrl: activity.certificateUrl
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching verification status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all verified activities for a student
const getStudentVerifiedActivities = async (req, res) => {
    try {
        const { studentId } = req.params;

        const activities = await Activity.find({
            user1Id: studentId,
            verificationStatus: { $in: ['approved', 'rejected'] }
        }).sort({ approvalDate: -1 });

        // Get faculty details for each approved activity
        const activitiesWithFacultyDetails = await Promise.all(
            activities.map(async (activity) => {
                let facultyDetails = null;
                if (activity.approvedByFacultyId) {
                    const faculty = await User.findOne({ user1Id: activity.approvedByFacultyId });
                    facultyDetails = {
                        facultyName: faculty?.fullName || activity.approvedByFaculty,
                        facultyEmail: faculty?.email || '',
                        facultyId: faculty?.user1Id || ''
                    };
                }
                return {
                    ...activity.toObject(),
                    facultyDetails: facultyDetails
                };
            })
        );

        res.json(activitiesWithFacultyDetails);
    } catch (error) {
        console.error('Error fetching student verified activities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getPendingVerifications,
    approveVerification,
    rejectVerification,
    getVerificationStatus,
    getStudentVerifiedActivities
};
