const express = require("express")
const router = express.Router()
const authMiddlewere = require("../middlewares/auth")

const {
    getHostel,
    getAllHostels,
} = require('../controllers/hostel')


router.get("/", getAllHostels)
router.get("/:hostelname", getHostel)


module.exports = router

