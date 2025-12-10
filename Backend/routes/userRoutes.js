const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Debug route
router.get('/debug/:userId', userController.checkUserExists);

// GET user profile by user1Id (for ProfileReview search)
router.get('/profile/:user1Id', userController.userProfile);

// GET user by userId (existing) - must be after /profile/:user1Id
router.get('/:userId', userController.userProfile);

// PUT update user profile
router.put('/:userId', userController.updateUserProfile);

module.exports = router;
