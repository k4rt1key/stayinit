const express = require("express")
const router = express.Router();
const { localFileUpload, cloudinaryUpload } = require("../controllers/file")

router.post("/local-file-upload", localFileUpload)
router.post("/cloudinary-upload", cloudinaryUpload)

module.exports = router