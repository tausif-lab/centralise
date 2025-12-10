const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventsByDate,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// GET all events
router.get('/', getAllEvents);

// GET events for a specific date
router.get('/date/:date', getEventsByDate);

// GET single event by ID
router.get('/:eventId', getEventById);

// CREATE new event
router.post('/', createEvent);

// UPDATE event
router.put('/:eventId', updateEvent);

// DELETE event
router.delete('/:eventId', deleteEvent);

module.exports = router;
