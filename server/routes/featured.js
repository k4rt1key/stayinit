const express = require("express");
const router = express.Router();

const {
    getFeaturedHostels
} = require("../controllers/hostel");

const {
    getFeaturedFlats
} = require("../controllers/flat");

router.get("/hostel", getFeaturedHostels);
router.get("/flat", getFeaturedFlats);

module.exports = router;