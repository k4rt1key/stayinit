const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");

const {
    getOneProfile,
    updateProfile,
} = require("../controllers/profile.js");


router.get('/:profileId', getOneProfile)

router.patch('/', authMiddleware, updateProfile)



module.exports = router;