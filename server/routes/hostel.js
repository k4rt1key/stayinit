const express = require("express")
const router = express.Router()
const authMiddlewere = require("../middlewares/auth")


const { getHostel, getAllHostels, addHostel, updateHostel, deleteHostel, addPriceAndSharingDetails, addHostelImage } = require('../controllers/hostel')


router.post("/", authMiddlewere, addHostel)

router.get("/", getAllHostels)
router.get("/:id", getHostel)

router.patch("/:id", authMiddlewere, updateHostel)
router.delete("/:id", authMiddlewere, deleteHostel)

router.post("/price", authMiddlewere, addPriceAndSharingDetails)

router.post("/hostel-image", authMiddlewere, addHostelImage)


module.exports = router

