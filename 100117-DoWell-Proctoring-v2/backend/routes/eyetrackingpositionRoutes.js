const { Router } = require("express");
const eyetrackingpositionController = require("../controller/eyetrackingpositionController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

const router = Router();

router.post('/new', eyetrackingpositionController.create_new_eyetracking_position);

module.exports = router;