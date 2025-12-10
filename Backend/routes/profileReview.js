const express = require('express');
const router = express.Router();
const { getUserProfile, getCollegeReport, updateCollegeReport } = require('../controllers/profileReviewController');

// Profile review routes
router.get('/profile-review/:userId', getUserProfile);
router.get('/college-report', getCollegeReport);
router.put('/college-report', updateCollegeReport); // For admin updates

module.exports = router;