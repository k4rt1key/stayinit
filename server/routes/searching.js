const express = require("express");
const router = express.Router()

const { searchProperties } = require("../controllers/searching");

router.get("/", searchProperties)

module.exports =  router;