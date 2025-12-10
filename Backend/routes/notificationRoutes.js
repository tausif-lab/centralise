const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/faculty/:facultyId', authenticateToken, notificationController.getFacultyNotifications);
router.get('/:facultyId/unread-count', authenticateToken, notificationController.getUnreadCount);
router.put('/:notificationId/read', authenticateToken, notificationController.markAsRead);
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);

module.exports = router;
