const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// GET all activities for a user by user1Id
router.get('/user/:user1Id', activityController.getUserActivities);

// GET all activities for a user (with optional category filter) - by userId
router.get('/:userId', activityController.getUserActivities);

// POST create new activity
router.post('/:userId', activityController.createActivity);

// PUT update activity
router.put('/:activityId', activityController.updateActivity);

// DELETE activity
router.delete('/:activityId', activityController.deleteActivity);

module.exports = router;