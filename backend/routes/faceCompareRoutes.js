const { Router } = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FaceCompareContriller = require("../controller/faceCompareController");

const router = Router();


// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post("", upload.fields([{ name: "image1" }, { name: "image2" }]), FaceCompareContriller.compare);

module.exports = router;
