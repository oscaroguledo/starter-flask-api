const { Router } = require("express");
const screenshotController = require("../controller/screenshotController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

// creating a new router
const router = Router();

router.post('/add', screenshotController.add);
router.get('/get', screenshotController.getByParams);
router.delete('/delete', screenshotController.delete);

module.exports = router;
