const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: String,
        required: true // Faculty user1Id
    },
    recipientEmail: {
        type: String,
        required: true
    },
    recipientRole: {
        type: String,
        enum: ['Hackathons', 'Sports', 'Workshops', 'Extracurricular Activity', 'student', 'faculty'],
        required: true
    },
    
    // Notification details
    type: {
        type: String,
        enum: ['certificate_approval_pending', 'certificate_approved', 'certificate_rejected', 'activity_verified', 'activity_rejected'],
        required: true
    },
    
    // Related entity references
    certificateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: false  // Optional for activity notifications
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    
    // Content
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    certificateFile: {
        type: String,
        required: false // URL to certificate (optional for activity notifications)
    },
    activityTitle: {
        type: String,
        required: true
    },
    activityCategory: {
        type: String,
        required: true
    },
    
    // Status tracking
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        required: false
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
notificationSchema.index({ recipientId: 1 });
notificationSchema.index({ recipientRole: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
