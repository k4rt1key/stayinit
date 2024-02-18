const Hostel = require("../models/Hostel")
const Flat = require("../models/Flat")
const cloudinary = require('cloudinary').v2

async function uploadToCloudinary(file, filename, folder, quality) {
    // Upload file to Cloudinary
    // Set options for Cloudinary upload
    const options = { folder };
    quality ? options.quality = quality : null;
    options.resource_type = "auto";
    options.public_id = filename;

    // Perform the actual upload to Cloudinary
    return cloudinary.uploader.upload(file.tempFilePath, options);
}


async function addImage(req, res) {

    try {

        // extract images object from the request body
        const {
            images
        } = req.body

        // extract propertyType and propertyId from the request params
        const { propertyType, propertyId } = req.params;

        // extract files from the request
        const reqFiles = req.files;

        // some validations
        // check if images is array 
        if (!Array.isArray(images)) {
            return res.status(400).json({
                success: false,
                message: 'Images must be an array'
            })
        }

        if (reqFiles === undefined || reqFiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images sent'
            })
        }

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images sent'
            })
        }

        if (!propertyType || !propertyId) {
            return res.status(400).json({
                success: false,
                message: 'Property type and property id are required'
            })
        }

        if (propertyType !== "hostel" && propertyType !== "flat") {
            return res.status(400).json({
                success: false,
                message: 'Invalid property type'
            })
        }


        if (images.length !== reqFiles.length) {
            return res.status(400).json({
                success: false,
                message: 'Number of images uploaded does not match the number of images sent'
            })
        }


        // uploading images to cloudinary
        for (let i = 0; i < images.length; i++) {
            // Define allowed file types
            const allowedTypes = ['jpeg', 'png', 'jpg'];

            // Check if the file type is allowed
            if (!allowedTypes.includes(reqFiles[i].name.split('.')[1])) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type',
                });
            }

            // and then save the url to the database
            const result = await uploadToCloudinary(reqFiles[i], images[i].title, images[i].propertyId);
            const secureURL = result.secureURL;
            images[i].url = secureURL;

        };

        // save the images to the database
        images.forEach(x => {

            const image = new Image({
                url: x.url,
                title: x.title,
                description: x.description,
                hostel: propertyType === "hostel" ? propertyId : null,
                flat: propertyType === "flat" ? propertyId : null,
            })

            async function saveImage(image) {
                await image.save();
            }
            saveImage(image);

            async function addImageToHostelOrFlat() {
                if (propertyType === "hostel") {
                    const hostel = await Hostel.findOneAndUpdate({ propertyId }, { $push: { images: image._id } }, { new: true });
                }

                if (propertyType === "flat") {
                    const flat = await Flat.findOneAndUpdate({ propertyId }, { $push: { images: image._id } }, { new: true });
                }
            }

            addImageToHostelOrFlat();
        });

        res.status(200)
            .json({
                success: true,
                message: "Images uploaded successfully",
                data: images
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `backend: ${error.message}`,
        });
    }
}

async function updateImage(req, res) { }
async function deleteImage(req, res) { }


module.exports = {
    addImage,
    updateImage,
    deleteImage,
}