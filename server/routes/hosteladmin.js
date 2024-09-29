// hosteladmin.js
const express = require('express');
const router = express.Router();
const { addImage, addHostel, updateHostel, deleteHostel, getOwnerHostels } = require('../controllers/admin/hostel');
const authMiddleware = require('../middlewares/auth');
const fileUpload = require('express-fileupload'); // Import express-fileupload


// Middleware for handling file uploads
router.use(fileUpload({
    useTempFiles: true, // Enables temporary file storage in the system
    tempFileDir: '/tmp/', // Directory to store temp files (can be customized)
}));
// Add a new hostel
router.post('/add', authMiddleware, addHostel);

// Update an existing hostel by its ID
router.put('/update/:id', authMiddleware, updateHostel);

// Delete an existing hostel by its ID
router.delete('/delete/:id', authMiddleware, deleteHostel);

// Get all hostels added by the authenticated owner
router.get('/', authMiddleware, getOwnerHostels);

router.post('/add-images/:id', authMiddleware, addImage);

module.exports = router;
