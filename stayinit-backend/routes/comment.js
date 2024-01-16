const express = require('express');
const router = express.Router();
const authMiddlewere = require('../middlewares/auth');

const {
    addComment,
    deleteComment
} = require('../controllers/comment');

router.post('/', authMiddlewere, addComment);
router.delete('/:commentId', authMiddlewere, deleteComment)


module.exports = router;