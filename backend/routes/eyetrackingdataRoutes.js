const { Router } = require("express");
const eyetrackingController = require("../controller/eyetrackingController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");


const router = Router();


router.get('/all', eyetrackingController.get_all_eyetracking);
router.get('/one',eyetrackingController.get_single_eyetracking);
router.post('/new', eyetrackingController.create_new_eyetracking);
router.patch('/eyetracking/:id', [validateMongoIdParam], eyetrackingController.update_eyetracking);
router.delete('/eyetracking/:id', [validateMongoIdParam], eyetrackingController.delete_eyetracking);

module.exports = router;