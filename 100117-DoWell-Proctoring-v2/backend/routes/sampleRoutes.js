const { Router } = require("express");
const sampleController = require("../controller/sampleController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

// creating a new router
const router = Router();

router.get('/all', sampleController.get_all_samples);
router.get('/sample/:id', [validateMongoIdParam], sampleController.get_single_sample);
router.post('/new', sampleController.create_new_sample);
router.patch('/sample/:id', [validateMongoIdParam], sampleController.update_sample);
router.delete('/sample/:id', [validateMongoIdParam], sampleController.delete_sample);

module.exports = router;
