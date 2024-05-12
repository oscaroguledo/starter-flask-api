const { Router } = require("express");
const messageController = require("../controller/messageController");

const router = Router();

// Route to create a new event chat store entry
router.post("/add", messageController.addmessageapi);
router.patch("/update", messageController.updatemessage);
router.post("/get", messageController.getByParams);
router.delete("/harddelete", messageController.harddelete);
router.patch("/softdelete", messageController.softdelete);


module.exports = router;
