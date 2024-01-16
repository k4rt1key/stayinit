const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth")

const {   
    getFlat,
    getAllFlats,
    addFlat,
    deleteFlat,
    updateFlat,
    addFlatImage } = require("../controllers/flat")

router.post("/", authMiddleware, addFlat)

router.get("/", getAllFlats)
router.get("/:id", getFlat)

router.patch("/:id", authMiddleware, updateFlat)
router.delete("/:id", authMiddleware, deleteFlat)

router.post("/flat-image", authMiddleware, addFlatImage)

module.exports = router

