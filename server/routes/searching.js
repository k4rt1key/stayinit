const express = require("express");
const router = express.Router()

const { searchCity, searchLocality } = require("../controllers/searching");

router.get("/city", searchCity)
router.get("/locality", searchLocality)


module.exports = router;