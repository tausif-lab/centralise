const Activity = require('../models/Activity');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const fs = require('fs');  // ADD THIS  
// Configure multer for file upload

const uploadDir = 'uploads/certificates/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads/certificates directory');
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/certificates/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed!'));
        }
    }
}).single('certificate');

// GET all activities for a user
/*const getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;
        const { category } = req.query;

        let query = { userId };
        if (category) {
            query.category = category;
        }

        const activities = await Activity.find(query).sort({ date: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/

// GET all activities for a user
const getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;  // This is user1Id from URL
        const { category } = req.query;

        // Find user first to get their ObjectId
        const user = await User.findOne({ user1Id: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        /*let query = { userId: user._id };  // Use ObjectId for query*/
        let query = { user1Id: userId };
        if (category) {
            query.category = category;
        }

        const activities = await Activity.find(query).sort({ date: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// CREATE new activity
/*const createActivity = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { userId } = req.params;
            const activityData = req.body;

            // Add certificate URL if file was uploaded
            if (req.file) {
                activityData.certificateUrl = `/uploads/certificates/${req.file.filename}`;
            }

            const newActivity = new Activity({
                userId,
                ...activityData,
                verificationStatus: req.file ? 'pending' : 'approved' // If certificate uploaded, set to pending
            });

            await newActivity.save();
            res.status(201).json(newActivity);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};*/
// CREATE new activity
const createActivity = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { userId } = req.params;  // This is user1Id from URL
            const activityData = req.body;

            // Fetch the user to get both _id and user1Id
            const user = await User.findOne({ user1Id: userId });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Add certificate URL if file was uploaded
            if (req.file) {
                activityData.certificateUrl = `/uploads/certificates/${req.file.filename}`;
            }

           /* const newActivity = new Activity({
                userId: user._id,           // MongoDB ObjectId
                user1Id: user.user1Id,      // Custom user1Id
                ...activityData,
                verificationStatus: req.file ? 'pending' : 'approved'
            });*/
            const newActivity = new Activity({
               userId: user.user1Id,       // Use user1Id as string
               user1Id: user.user1Id,      // Custom user1Id
               ...activityData,
                 verificationStatus: req.file ? 'pending' : 'approved'
          });

            await newActivity.save();
            res.status(201).json(newActivity);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

// UPDATE activity
const updateActivity = async (req, res) => {
    try {
        const { activityId } = req.params;
        const updateData = req.body;

        const activity = await Activity.findByIdAndUpdate(
            activityId,
            { 
                $set: {
                    ...updateData,
                    updatedAt: Date.now()
                }
            },
            { new: true, runValidators: true }
        );

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE activity
const deleteActivity = async (req, res) => {
    try {
        const { activityId } = req.params;

        const activity = await Activity.findByIdAndDelete(activityId);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserActivities,
    createActivity,
    updateActivity,
    deleteActivity
};