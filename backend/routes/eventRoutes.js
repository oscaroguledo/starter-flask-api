const { Router } = require("express");
const EventController = require('../controller/eventController');
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

// creating a new router
const router = Router();

router.get('/all', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.post('/new', EventController.createEvent);
router.patch('/:id', [validateMongoIdParam], EventController.updateEvent);
router.delete('/:id', [validateMongoIdParam], EventController.deleteEvent);

module.exports = router;