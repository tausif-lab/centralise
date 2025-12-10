const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Get pending verification requests for a faculty
router.get('/faculty/:facultyId/pending', verificationController.getPendingVerifications);

// Approve an activity verification
router.post('/:activityId/approve', verificationController.approveVerification);

// Reject an activity verification
router.post('/:activityId/reject', verificationController.rejectVerification);

// Get verification status for a specific activity
router.get('/:activityId/status', verificationController.getVerificationStatus);

// Get all verified activities for a student
router.get('/student/:studentId/verified', verificationController.getStudentVerifiedActivities);

module.exports = router;
