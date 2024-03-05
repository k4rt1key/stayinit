const cloudinary = require('cloudinary').v2

const localFileUpload = (req, res) => {
    // Handling local file upload

    // Extract file from request
    const file = req.files.file;

    // Define the path for storing the file
    const path = __dirname + "../files/" + Date.now() + `.${file.name.split(".")[1]}`

    // Move the file to the specified path
    file.mv(path, (error) => {
        if (error) {
            // Return error response if file upload fails
            return res.status(500).json({
                success: false,
                message: "Failed to upload file",
                error: `Backend: ${error.message}`,
            });
        } else {
            // Return success response with file details
            return res.json({
                success: true,
                message: "File uploaded successfully",
                data: { name: file.name, path: path }
            });
        }
    });
};

async function uploadToCloudinary(file, folder, quality) {
    // Upload file to Cloudinary

    // Set options for Cloudinary upload
    const options = { folder };
    quality ? options.quality = quality : null;
    options.resource_type = "auto";

    // Perform the actual upload to Cloudinary
    return cloudinary.uploader.upload(file.tempFilePath, options);
}

async function cloudinaryUpload(req, res) {
    // Handling file upload to Cloudinary

    try {
        // Extract file and metadata from request
        const file = req.files.imageFile;
        const { name, tags } = req.body;

        // Define allowed file types
        const allowedTypes = ['jpeg', 'png', 'jpg'];

        // Check if the file type is allowed
        if (!allowedTypes.includes(file.name.split('.')[1])) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type',
            });
        }

        // Upload file to Cloudinary
        const result = await uploadToCloudinary(file, "kartik");

        // Create a record in the database for the uploaded file
        const fileInDB = await File.create({
            name,
            url: result.secure_url,
            tags
        });

        // Return success response with details of the uploaded file
        res.json({
            success: true,
            message: "File uploaded successfully to Cloudinary",
            data: fileInDB
        });
    } catch (error) {
        // Return error response if any step in the process fails
        return res.status(500).json({
            success: false,
            message: "Failed to upload file to Cloudinary",
            error: `Backend: ${error.message}`,
        });
    }
}

module.exports = {
    localFileUpload,
    cloudinaryUpload
}
