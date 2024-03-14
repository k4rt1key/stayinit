const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth")

const {
    getFlat,
    getAllFlats,
} = require("../controllers/flat")

router.get("/", getAllFlats)
router.get("/:flatname", getFlat)



module.exports = router

