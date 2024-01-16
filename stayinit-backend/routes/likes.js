const express = require("express")
const router = express.Router()

const authMiddlewere = require("../middlewares/auth")

const {
    like,
    getLikedProperties,
    unlike,
} = require("../controllers/likes")

router.post("/", authMiddlewere, like)

router.get("/", authMiddlewere, getLikedProperties)

router.delete("/:type/:propertyId", authMiddlewere, unlike)

module.exports = router
