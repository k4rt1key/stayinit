// flatadmin.js
const express = require('express');
const router = express.Router();
const { addImage, addFlat, updateFlat, deleteFlat, getOwnerFlats } = require('../controllers/admin/flat.js');
const authMiddleware = require('../middlewares/auth.js');
const upload = require('../config/multer');

router.post('/add', authMiddleware, addFlat);
router.put('/update/:id', authMiddleware, updateFlat);
router.delete('/delete/:id', authMiddleware, deleteFlat);
router.get('/', authMiddleware, getOwnerFlats);
router.post('/add-images/:id', upload.array('images', 10), addImage);

module.exports = router;