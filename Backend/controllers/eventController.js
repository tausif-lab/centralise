const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/events/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads/events directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/*const fileFilter = (req, file, cb) => {
    // Allow PDF, DOC, DOCX, XLS, XLSX for documents
    // Allow JPG, JPEG, PNG, GIF for images
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPG, PNG, GIF) and documents (PDF, DOC, XLS) are allowed!'));
    }
};*/
const fileFilter = (req, file, cb) => {
    // Allow PDF for all, images for notice and attendance
    const documentTypes = /pdf|doc|docx|xls|xlsx/;
    const imageTypes = /jpeg|jpg|png|gif/;
    
    const extname = path.extname(file.originalname).toLowerCase();
    const isDocument = documentTypes.test(extname);
    const isImage = imageTypes.test(extname);
    
    // Allow images for noticeFile, attendanceSheet, and photos
    // Allow documents only for noticeFile and attendanceSheet
    if (file.fieldname === 'photos' && isImage) {
        return cb(null, true);
    } else if ((file.fieldname === 'noticeFile' || file.fieldname === 'attendanceSheet') && (isImage || isDocument)) {
        return cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: images (JPG, PNG, GIF) and documents (PDF, DOC, XLS)`));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
    fileFilter: fileFilter
}).fields([
    { name: 'noticeFile', maxCount: 1 },
    { name: 'attendanceSheet', maxCount: 1 },
    { name: 'photos', maxCount: 3 }
]);

// GET all events
const getAllEvents = async (req, res) => {
    try {
        const { date, status } = req.query;
        let query = {};

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        if (status) {
            query.verificationStatus = status;
        }

        const events = await Event.find(query).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        console.error('getAllEvents error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET events for a specific date
const getEventsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const events = await Event.find({
            date: { $gte: startDate, $lt: endDate }
        }).sort({ date: -1 });

        res.json(events);
    } catch (error) {
        console.error('getEventsByDate error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET single event
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('getEventById error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// CREATE new event with file uploads
const createEvent = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        try {
            const eventData = req.body;

            // Parse date if it comes as string
            if (typeof eventData.date === 'string') {
                eventData.date = new Date(eventData.date);
            }

            // Validate required fields
            if (!eventData.eventTitle || !eventData.type || !eventData.organizer || !eventData.date) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: eventTitle, type, organizer, date'
                });
            }
            /*
            // Process file uploads
            if (req.files) {
                if (req.files.noticeFile && req.files.noticeFile[0]) {
                    eventData.noticeFile = [{
                        filename: req.files.noticeFile[0].filename,
                        url: `/uploads/events/${req.files.noticeFile[0].filename}`,
                        uploadedAt: new Date()
                    }];
                }

                if (req.files.attendanceSheet && req.files.attendanceSheet[0]) {
                    eventData.attendanceSheet = [{
                        filename: req.files.attendanceSheet[0].filename,
                        url: `/uploads/events/${req.files.attendanceSheet[0].filename}`,
                        uploadedAt: new Date()
                    }];
                }

                if (req.files.photos && req.files.photos.length > 0) {
                    eventData.photos = req.files.photos.map(file => ({
                        filename: file.filename,
                        url: `/uploads/events/${file.filename}`,
                        uploadedAt: new Date()
                    }));
                }
            }*/


            if (req.files) {
    if (req.files.noticeFile && req.files.noticeFile[0]) {
        const file = req.files.noticeFile[0];
        eventData.noticeFile = [{
            filename: file.filename,
            url: `/uploads/events/${file.filename}`,
            fileType: file.mimetype, // ADD THIS
            uploadedAt: new Date()
        }];
    }

    if (req.files.attendanceSheet && req.files.attendanceSheet[0]) {
        const file = req.files.attendanceSheet[0];
        eventData.attendanceSheet = [{
            filename: file.filename,
            url: `/uploads/events/${file.filename}`,
            fileType: file.mimetype, // ADD THIS
            uploadedAt: new Date()
        }];
    }

    if (req.files.photos && req.files.photos.length > 0) {
        eventData.photos = req.files.photos.map(file => ({
            filename: file.filename,
            url: `/uploads/events/${file.filename}`,
            fileType: file.mimetype, // ADD THIS
            uploadedAt: new Date()
        }));
    }
}    

            const newEvent = new Event({
                ...eventData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newEvent.save();

            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                event: newEvent
            });
        } catch (error) {
            console.error('createEvent error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    });
};

// UPDATE event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updateData = req.body;

        // Parse date if it comes as string
        if (typeof updateData.date === 'string') {
            updateData.date = new Date(updateData.date);
        }

        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                $set: {
                    ...updateData,
                    updatedAt: Date.now()
                }
            },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            event: event
        });
    } catch (error) {
        console.error('updateEvent error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// DELETE event
const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('deleteEvent error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllEvents,
    getEventsByDate,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
