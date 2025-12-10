const User = require('../models/User');
const Activity = require('../models/Activity');
const ProfileReview = require('../models/ProfileReview');

// Get user profile by user1Id
/*const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Searching for user with identifier:', userId);

        // Check if searching for college report
        if (userId.toUpperCase() === 'GEC001') {
            return getCollegeReport(req, res);
        }

        // Search for individual user
        let user = await User.findById(userId).select('-password');
        
        if (!user) {
            user = await User.findOne({ user1Id: userId }).select('-password');
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user.user1Id, user.fullName);

        // For students, fetch their verified activities
        if (user.role === 'student') {
            const activities = await Activity.find({
                user1Id: user.user1Id,
                verificationStatus: 'approved'
            }).sort({ date: -1 });

            return res.json({
                type: 'student',
                profile: user,
                activities: activities
            });
        }

        // For Faculty Incharge
        if (user.role === 'FacultyIncharge') {
            return res.json({
                type: 'faculty',
                profile: user
            });
        }

        // For other roles
        return res.json({
            type: 'user',
            profile: user
        });

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Searching for user with identifier:', userId);

        // Check if searching for college report
        if (userId.toUpperCase() === 'GEC001') {
            return getCollegeReport(req, res);
        }

        // Check for dummy data first
        if (DUMMY_DATA[userId]) {
            console.log('Returning dummy data for:', userId);
            return res.json(DUMMY_DATA[userId]);
        }

        // Search for individual user in database
        let user = await User.findById(userId).select('-password');
        
        if (!user) {
            user = await User.findOne({ user1Id: userId }).select('-password');
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user.user1Id, user.fullName);

        // For students, fetch their verified activities
        if (user.role === 'student') {
            const activities = await Activity.find({
                user1Id: user.user1Id,
                verificationStatus: 'approved'
            }).sort({ date: -1 });

            return res.json({
                type: 'student',
                profile: user,
                activities: activities
            });
        }

        // For Faculty Incharge
        if (user.role === 'FacultyIncharge') {
            return res.json({
                type: 'faculty',
                profile: user
            });
        }

        // For other roles
        return res.json({
            type: 'user',
            profile: user
        });

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Add dummy data mapping at the top of the file, after requires
const DUMMY_DATA = {
    '301602223057': {
        type: 'student',
        profile: {
            fullName: "Tausif Khan",
            email: "tautumhare@gmail.com",
            collegeId: "GEC001",
            user1Id: "301602223057",
            branch: "CSE",
            role: "student",
            isActive: true,
            bio: "",
            cgpa: "6 CGPA",
            github: "https://github.com/tausif-lab",
            linkedin: "https://www.linkedin.com/in/tausif-khan-bb1a10352/",
            location: "",
            phone: "9244281486",
            semester: "3 year",
            skills: ["react", "Mongodb", "node.js", "Express.js", "Tailwind.css", "Next.js"]
        },
        activities: [{
            _id: "dummy_activity_1",
            userId: "301602223057",
            user1Id: "301602223057",
            category: "hackathons",
            title: "Amity Hackthon (Algostrome 1.0)",
            description: "Won first prize on the amity University",
            date: "2025-08-22T00:00:00.000+00:00",
            location: "Amity University",
            certificateUrl: "/uploads/certificates/cert-1762080384676-348937824.jpeg",
            verificationStatus: "approved",
            activityStatus: "completed",
            approvalDate: "2025-11-02T11:26:34.645+00:00",
            approvedByFaculty: "Jalil Khan",
            approvedByFacultyId: "301602223056",
            facultyRole: "Hackathons"
        }]
    },
    '301602223056': {
        type: 'faculty',
        profile: {
            fullName: "Jalil Khan",
            email: "jalilkhan@gmail.com",
            collegeId: "GEC001",
            user1Id: "301602223056",
            branch: "CSE",
            role: "FacultyIncharge",
            facultyInchargeType: "Hackathons",
            isActive: true,
            phone: "",
            location: "",
            bio: "",
            skills: []
        }
    }
};


// Get college-wide report
/*const getCollegeReport = async (req, res) => {
    try {
        // Try to fetch from database first
        let report = await ProfileReview.findOne({ collegeId: 'GEC001' });

        // If not found, create dummy data
        if (!report) {
            report = {
                collegeId: 'GEC001',
                academicYear: '2024-25',
                eventsByType: [
                    { name: 'Sports', count: 15 },
                    { name: 'Hackathon', count: 8 },
                    { name: 'Workshop', count: 12 },
                    { name: 'Cultural', count: 10 },
                    { name: 'Seminar', count: 6 }
                ],
                eventsByNAAC: [
                    { name: '5.3.1', value: 20 },
                    { name: '5.3.3', value: 15 },
                    { name: '5.1.1', value: 10 },
                    { name: '3.3.2', value: 8 },
                    { name: 'Others', value: 12 }
                ],
                monthlyData: [
                    { month: 'Jan', count: 12 },
                    { month: 'Feb', count: 15 },
                    { month: 'Mar', count: 18 },
                    { month: 'Apr', count: 10 },
                    { month: 'May', count: 14 },
                    { month: 'Jun', count: 16 }
                ],
                departmentStats: [
                    { department: 'CSE', studentCount: 240, activityCount: 45 },
                    { department: 'ECE', studentCount: 180, activityCount: 32 },
                    { department: 'ME', studentCount: 160, activityCount: 28 },
                    { department: 'CE', studentCount: 140, activityCount: 24 }
                ],
                summary: {
                    totalEvents: 51,
                    totalParticipants: 1247,
                    eventCategories: 8,
                    departments: 12
                },
                lastUpdated: new Date()
            };
        }

        return res.json({
            type: 'college',
            report: report
        });

    } catch (error) {
        console.error('Error in getCollegeReport:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/
const getCollegeReport = async (req, res) => {
    try {
        // Use exact dummy data from ReportGeneration.jsx
        const report = {
            collegeId: 'GEC001',
            academicYear: '2024-25',
            eventsByType: [
                { name: 'Sports', count: 15 },
                { name: 'Hackathon', count: 8 },
                { name: 'Workshop', count: 12 },
                { name: 'Cultural', count: 10 },
                { name: 'Seminar', count: 6 }
            ],
            eventsByNAAC: [
                { name: '5.3.1', value: 20 },
                { name: '5.3.3', value: 15 },
                { name: '5.1.1', value: 10 },
                { name: '3.3.2', value: 8 },
                { name: 'Others', value: 12 }
            ],
            monthlyData: [
                { month: 'Jan', count: 12 },
                { month: 'Feb', count: 15 },
                { month: 'Mar', count: 18 },
                { month: 'Apr', count: 10 },
                { month: 'May', count: 14 },
                { month: 'Jun', count: 16 }
            ],
            summary: {
                totalEvents: 51,
                totalParticipants: 1247,
                eventCategories: 8,
                departments: 12
            },
            lastUpdated: new Date()
        };

        return res.json({
            type: 'college',
            report: report
        });

    } catch (error) {
        console.error('Error in getCollegeReport:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update college report (for admin use)
const updateCollegeReport = async (req, res) => {
    try {
        const reportData = req.body;

        let report = await ProfileReview.findOneAndUpdate(
            { collegeId: 'GEC001' },
            { 
                ...reportData,
                lastUpdated: Date.now()
            },
            { new: true, upsert: true }
        );

        res.json({
            message: 'College report updated successfully',
            report: report
        });

    } catch (error) {
        console.error('Error updating college report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    getCollegeReport,
    updateCollegeReport
};