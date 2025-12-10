const mongoose = require('mongoose');

const profileReviewSchema = new mongoose.Schema({
    collegeId: {
        type: String,
        required: true,
        unique: true,
        default: 'GEC001'
    },
    academicYear: {
        type: String,
        required: true,
        default: '2024-25'
    },
    // College-wide statistics
    totalStudents: {
        type: Number,
        default: 0
    },
    totalFaculty: {
        type: Number,
        default: 0
    },
    totalActivities: {
        type: Number,
        default: 0
    },
    verifiedActivities: {
        type: Number,
        default: 0
    },
    // Event statistics by type
    eventsByType: [{
        name: String,
        count: Number
    }],
    // NAAC criterion distribution
    eventsByNAAC: [{
        name: String,
        value: Number
    }],
    // Monthly activity data
    monthlyData: [{
        month: String,
        count: Number
    }],
    // Department-wise statistics
    departmentStats: [{
        department: String,
        studentCount: Number,
        activityCount: Number
    }],
    // Summary metrics
    summary: {
        totalEvents: Number,
        totalParticipants: Number,
        eventCategories: Number,
        departments: Number
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ProfileReview', profileReviewSchema);