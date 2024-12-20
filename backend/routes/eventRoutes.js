const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();

router.post('/create-event', eventController.createEvent);
router.post('/add-attendee', eventController.addAttendee);
router.get('/event-details/:eventName', eventController.getEventDetails);
router.get('/sort-attendees/:eventName', eventController.sortAttendees);
router.get('/priority-attendees/:eventName', eventController.priorityAttendees);
router.delete('/delete-attendee', eventController.deleteAttendee);
router.put('/modify-attendee', eventController.modifyAttendee);
router.delete('/dequeue-attendee/:eventName', eventController.dequeueAttendee);

module.exports = router;