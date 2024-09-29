const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload'); // Import express-fileupload
const { addImage, addFlat, updateFlat, deleteFlat, getOwnerFlats } = require('../controllers/admin/flat');
const authMiddleware = require('../middlewares/auth');

// Middleware for handling file uploads
router.use(fileUpload({
    useTempFiles: true, // Enables temporary file storage in the system
    tempFileDir: '/tmp/', // Directory to store temp files (can be customized)
}));

// Flat routes
router.post('/add', authMiddleware, addFlat);
router.put('/update/:id', authMiddleware, updateFlat);
router.delete('/delete/:id', authMiddleware, deleteFlat);
router.get('/', authMiddleware, getOwnerFlats);

// Add image route
router.post('/add-images/:id', authMiddleware, addImage);

module.exports = router;
