const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    user1Id: {
        type: String,
        required: true
    },
    certificateFile: {
        type: String,
        required: true // URL to the uploaded certificate file
    },
    category: {
        type: String,
        enum: ['Workshops', 'Hackathons', 'Sports', 'Extracurricular Activity'],
        required: true
    },
    activityTitle: {
        type: String,
        required: true
    },
    
    // Cryptographic fields
    certificateHash: {
        type: String,
        required: true // SHA-256 hash of the certificate
    },
    digitalSignature: {
        type: String,
        required: false // RSA digital signature
    },
    signatureData: {
        type: String,
        required: false // Data that was signed
    },
    
    // Approval workflow
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: String,
        required: false // Faculty name who approved
    },
    approverRole: {
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
        required: false
    },
    
    // Audit trail
    submittedAt: {
        type: Date,
        default: Date.now
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

// Index for faster queries
certificateSchema.index({ studentId: 1, category: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ approverRole: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
