const { Router } = require("express");
const statusController = require("../controller/statusController");

// creating a new router
const router = Router();

router.get('/', statusController.get_api_status);

module.exports = router;