const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth")

const {   
    getFlat,
    getAllFlats,
    addFlat,
    deleteFlat,
    updateFlat,
    addFlatImage,
    addNearestLandmarks,
} = require("../controllers/flat")

router.post("/", authMiddleware, addFlat)

router.get("/", getAllFlats)
router.get("/:flatname", getFlat)

router.patch("/:id", authMiddleware, updateFlat)
router.delete("/:id", authMiddleware, deleteFlat)

router.post("/flat-image", authMiddleware, addFlatImage)

router.post("/nearest-landmarks", authMiddleware, addNearestLandmarks)

module.exports = router

