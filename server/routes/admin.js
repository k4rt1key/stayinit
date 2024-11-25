const express = require("express");
const router = express.Router();
const authMiddlewere = require("../middlewares/auth")

const {
    deleteFlat,
    deleteHostel,
    deleteUser
} = require("../controllers/admin/admin");

router.delete('/delete-flat/:id', authMiddlewere, deleteFlat);
router.delete('/delete-hostel/:id', authMiddlewere, deleteHostel);
router.delete('/delete-user/:id', authMiddlewere, deleteUser);

module.exports = router;