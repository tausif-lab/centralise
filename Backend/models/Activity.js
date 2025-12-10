const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        
    },
   user1Id: {                    // ADD THIS NEW FIELD
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['workshops', 'internships', 'achievements', 'hackathons', 'sports'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date // For internships
    },
    location: {
        type: String,
        default: ''
    },
    company: {
        type: String // For internships
    },
    event: {
        type: String // For achievements
    },
    certificateUrl: {
        type: String,
        default: ''
    },
    certificateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedByFaculty: {
        type: String,
        required: false  // Faculty name who approved
    },
    approvedByFacultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Faculty ObjectId who approved
    },
    approvedByFacultyUser1Id: {
        type: String,
        required: false  // Faculty user1Id who approved (for easy access)
    },
    facultyRole: {
        type: String,
        enum: ['Hackathons', 'Sports', 'Workshops', 'Extracurricular Activity'],
        required: false
    },
    approvalDate: {
        type: Date,
        required: false
    },
    rejectionReason: {
        type: String,
        required: false  // NEW: Reason for rejection if rejected
    },
    certificateSignature: {
        type: String,
        required: false // Digital signature from certificate
    },
    certificateHash: {
        type: String,
        required: false // SHA-256 hash of certificate
    },
    activityStatus: {
        type: String,
        enum: ['ongoing', 'completed'],
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', activitySchema);