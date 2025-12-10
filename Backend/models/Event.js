const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    eventTitle: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Sports', 'Hackathon', 'Workshop', 'Seminar', 'Cultural Event', 'Tech Fest', 'Conference', 'Competition', 'Guest Lecture', 'Other']
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    noticeFile: [{
        filename: String,
        url: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    attendanceSheet: [{
        filename: String,
        url: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    photos: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    eventReport: {
        type: String,
        required: true
    },
    naacCategory: {
        type: String,
        required: true
    },
    facultyApproval: {
        type: Boolean,
        default: false
    },
    verificationDate: {
        type: Date,
        default: Date.now
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvalNotes: {
        type: String,
        default: ''
    },
    approvedBy: {
        type: String,
        required: false
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

module.exports = mongoose.model('Event', eventSchema);
