const Notification = require('../models/Notification');
const User = require('../models/User');

// Create notification for faculty based on their role
const createCertificateNotification = async (certificateData, activityData, studentData, notificationType = 'certificate_approval_pending') => {
    try {
        // Find all faculty with the matching role for this certificate
        const matchingRole = certificateData.category; // e.g., 'Hackathons', 'Sports', etc.
        
        const faculty = await User.find({
            role: 'FacultyIncharge',
            facultyInchargeType: matchingRole,
            collegeId: studentData.collegeId,
            isActive: true
        });
        
        if (faculty.length === 0) {
            console.log(`No faculty found for role: ${matchingRole}`);
            return [];
        }
        
        // Create notification for each matching faculty
        const notifications = [];
        for (const facultyMember of faculty) {
            const notification = new Notification({
                recipientId: facultyMember.user1Id,
                recipientEmail: facultyMember.email,
                recipientRole: matchingRole,
                type: notificationType,
                certificateId: certificateData._id,
                activityId: activityData._id,
                studentId: studentData.user1Id,
                studentName: studentData.fullName,
                title: `New Certificate Approval Request - ${activityData.title}`,
                message: `${studentData.fullName} has submitted a certificate for ${activityData.category.toLowerCase()} activity: "${activityData.title}". Please review and approve or reject.`,
                certificateFile: certificateData.certificateFile,
                activityTitle: activityData.title,
                activityCategory: activityData.category,
                isRead: false
            });
            
            await notification.save();
            notifications.push(notification);
        }
        
        return notifications;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error(`Failed to create notification: ${error.message}`);
    }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            {
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );
        
        return notification;
    } catch (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
};

// Get notifications for a faculty member
const getFacultyNotifications = async (facultyId, role = null, isRead = null) => {
    try {
        let query = { recipientId: facultyId };
        
        if (role) {
            query.recipientRole = role;
        }
        
        if (isRead !== null) {
            query.isRead = isRead;
        }
        
        const notifications = await Notification.find(query)
            .populate('certificateId')
            .populate('activityId')
            .sort({ createdAt: -1 })
            .lean();
        
        return notifications;
    } catch (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
};

// Count unread notifications
const countUnreadNotifications = async (facultyId, role = null) => {
    try {
        let query = { recipientId: facultyId, isRead: false };
        
        if (role) {
            query.recipientRole = role;
        }
        
        const count = await Notification.countDocuments(query);
        return count;
    } catch (error) {
        throw new Error(`Failed to count unread notifications: ${error.message}`);
    }
};

// Create approval notification
const createApprovalNotification = async (certificateData, studentData, approverData) => {
    try {
        const notification = new Notification({
            recipientId: studentData.user1Id,
            recipientEmail: studentData.email,
            recipientRole: certificateData.category,
            type: 'certificate_approved',
            certificateId: certificateData._id,
            activityId: certificateData.activityId,
            studentId: studentData.user1Id,
            studentName: studentData.fullName,
            title: `Certificate Approved - ${certificateData.activityTitle}`,
            message: `Your certificate for "${certificateData.activityTitle}" has been approved by ${approverData.fullName}.`,
            certificateFile: certificateData.certificateFile,
            activityTitle: certificateData.activityTitle,
            activityCategory: certificateData.category,
            isRead: false
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error(`Failed to create approval notification: ${error.message}`);
    }
};

// Create rejection notification
const createRejectionNotification = async (certificateData, studentData, approverData, reason) => {
    try {
        const notification = new Notification({
            recipientId: studentData.user1Id,
            recipientEmail: studentData.email,
            recipientRole: certificateData.category,
            type: 'certificate_rejected',
            certificateId: certificateData._id,
            activityId: certificateData.activityId,
            studentId: studentData.user1Id,
            studentName: studentData.fullName,
            title: `Certificate Rejected - ${certificateData.activityTitle}`,
            message: `Your certificate for "${certificateData.activityTitle}" has been rejected by ${approverData.fullName}. Reason: ${reason}`,
            certificateFile: certificateData.certificateFile,
            activityTitle: certificateData.activityTitle,
            activityCategory: certificateData.category,
            isRead: false
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error(`Failed to create rejection notification: ${error.message}`);
    }
};

// Delete notification
const deleteNotification = async (notificationId) => {
    try {
        const notification = await Notification.findByIdAndDelete(notificationId);
        return notification;
    } catch (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
    }
};

// Create activity approval/rejection notification
const createActivityApprovalNotification = async (activityData, studentData, facultyData, status, notes = '') => {
    try {
        const isApproved = status === 'approved';
        const notificationType = isApproved ? 'activity_verified' : 'activity_rejected';
        const title = isApproved 
            ? `Activity Verified - ${activityData.title}` 
            : `Activity Rejected - ${activityData.title}`;
        const message = isApproved
            ? `Your ${activityData.category} activity "${activityData.title}" has been verified by ${facultyData.fullName} (${facultyData.facultyInchargeType}). ${notes ? 'Notes: ' + notes : ''}`
            : `Your ${activityData.category} activity "${activityData.title}" has been rejected by ${facultyData.fullName}. Reason: ${notes}`;
        
        const notification = new Notification({
            recipientId: studentData.user1Id,
            recipientEmail: studentData.email,
            recipientRole: 'student',
            type: notificationType,
            activityId: activityData._id,
            certificateId: activityData.certificateId || null,  // Optional
            studentId: studentData.user1Id,
            studentName: studentData.fullName,
            title: title,
            message: message,
            certificateFile: activityData.certificateUrl || '',  // Optional
            activityTitle: activityData.title,
            activityCategory: activityData.category,
            isRead: false
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating activity approval notification:', error);
        throw new Error(`Failed to create activity approval notification: ${error.message}`);
    }
};

module.exports = {
    createCertificateNotification,
    markNotificationAsRead,
    getFacultyNotifications,
    countUnreadNotifications,
    createApprovalNotification,
    createRejectionNotification,
    deleteNotification,
    createActivityApprovalNotification
};
