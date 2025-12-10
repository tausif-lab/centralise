const notificationService = require('../services/notificationService');

const getFacultyNotifications = async (req, res) => {
    try {
        const { facultyId } = req.params;
        const { role, isRead } = req.query;
        let isReadValue = null;
        if (isRead !== undefined) {
            isReadValue = isRead === 'true' ? true : isRead === 'false' ? false : null;
        }
        const notifications = await notificationService.getFacultyNotifications(facultyId, role || null, isReadValue);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const { facultyId } = req.params;
        const { role } = req.query;
        const count = await notificationService.countUnreadNotifications(facultyId, role || null);
        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationService.markNotificationAsRead(notificationId);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationService.deleteNotification(notificationId);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getFacultyNotifications, getUnreadCount, markAsRead, deleteNotification };
