const express = require("express");
const router = express.Router();

const {
    getFeaturedHostels
} = require("../controllers/hostel");

router.get("/hostel", getFeaturedHostels);

module.exports = router;