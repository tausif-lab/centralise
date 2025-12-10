
const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const activityRoutes = require('./activityRoutes');
const certificateRoutes = require('./certificateRoutes');
const notificationRoutes = require('./notificationRoutes');
const verificationRoutes = require('./verificationRoutes');
const profileReviewRoutes = require('./profileReview');
const portfolioRoutes = require('./portfolioRoutes');
const eventRoutes = require('./eventRoutes');
const router = express.Router();

// Mount API routes first (more specific routes)
router.use('/api/auth', authRoutes);       // Authentication 
router.use('/api/user', userRoutes);               // User-related routes
router.use('/api/activities', activityRoutes);
router.use('/api/certificates', certificateRoutes);
router.use('/api/notifications', notificationRoutes);
router.use('/api/verifications', verificationRoutes);  // Activity verification routes
router.use('/api/portfolio', portfolioRoutes);    // Portfolio routes
router.use('/api/events', eventRoutes);    // Event management routes
router.use('/api/profile-review', profileReviewRoutes);

module.exports = router;
