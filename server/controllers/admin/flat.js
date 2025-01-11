const cloudinary = require('../../config/cloudinary');
const Flat = require('../../models/Flat');

async function addImage(req, res) {
    try {
        const flat = await Flat.findById(req.params.id);
        if (!flat) {
            return res.status(404).json({
                success: false,
                error: "Flat not found",
            });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No files were uploaded.",
            });
        }

        const images = req.files.images; // 'images' is the field name in the form
        const uploadedImagePaths = [];

        // Handle both single and multiple image uploads
        const imageArray = Array.isArray(images) ? images : [images];

        // Upload each image to Cloudinary
        for (const image of imageArray) {
            const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'uploads', // Optional: Define the folder in Cloudinary
                use_filename: true,
                unique_filename: false,
            });

            // Store the uploaded image URL in the array
            uploadedImagePaths.push(uploadResult.secure_url);
        }

        // Add image URLs to the Flat document
        uploadedImagePaths.forEach(path => flat.images.push(path));

        const updatedFlat = await flat.save();

        res.status(200).json({
            success: true,
            message: "Images added successfully!",
            data: updatedFlat,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Error adding image: " + error.message,
        });
    }
}


async function addFlat(req, res) {
    try {
        const newFlatObj = new Flat({
            type: "flat",
            uniqueName: req?.body?.uniqueName,
            name: req?.body?.name,
            developer: req?.body?.developer,
            price: req?.body?.price,
            bhk: req?.body?.bhk,
            sqft: req?.body?.sqft,
            furnitureType: req?.body?.furnitureType,
            address: req?.body?.address,
            locality: req?.body?.locality,
            city: req?.body?.city,
            pincode: req?.body?.pincode,
            addressLink: req?.body?.addressLink,
            contactNumber: req?.body?.contactNumber,
            contactEmail: req?.body?.contactEmail,
            addedBy: req?.profile?._id,
            comments: [],
            likes: [],
            atWhichFloor: req?.body?.atWhichFloor,
            totalFloors: req?.body?.totalFloors,
            description: req?.body?.description,
            bathrooms: req?.body?.bathRooms,
            isFeatured: req?.body?.isFeatured,
        });

        const newFlat = await newFlatObj.save();

        res.status(201).json({
            success: true,
            message: "Flat added successfully!",
            data: newFlat
        });
    } catch (error) {
        res.status(400).json({
            sucess: false,
            error: "Error adding flat please fill out form data correctly"
        });
        console.log(error.message)
    }
};

async function updateFlat(req, res) {
    try {
        const updationObj = {
            uniqueName: req?.body?.uniqueName,
            name: req?.body?.name,
            developer: req?.body?.developer,
            price: req?.body?.price,
            bhk: req?.body?.bhk,
            sqft: req?.body?.sqft,
            furnitureType: req?.body?.furnitureType,
            address: req?.body?.address,
            locality: req?.body?.locality,
            city: req?.body?.city,
            pincode: req?.body?.pincode,
            addressLink: req?.body?.addressLink,
            contactNumber: req?.body?.contactNumber,
            contactEmail: req?.body?.contactEmail,
            atWhichFloor: req?.body?.atWhichFloor,
            totalFloors: req?.body?.totalFloors,
            description: req?.body?.description,
            bathrooms: req?.body?.bathRooms,
        }

        const updatedFlat = await Flat.findByIdAndUpdate(
            req.params.id,
            updationObj,
            { new: true, runValidators: true }
        );

        if (!updatedFlat) {
            return res.status(404).json({
                success: false,
                error: "Flat not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Flat updated successfully!",
            data: updatedFlat
        });
    } catch (error) {
        res.status(400).json({
            sucess: false,
            error: "Error updating flat: " + error.message,
        });
    }
};

async function deleteFlat(req, res) {
    try {
        const flat = await Flat.findById(req.params.id);
        if (!flat) {
            return res.status(404).json({
                success: false,
                error: "Flat not found"
            });
        }

        await flat.deleteOne();
        res.status(200).json({
            success: true,
            message: "Flat deleted successfully!"
        });
    } catch (error) {
        res.status(400).json({ error: "Error deleting flat: " + error.message });
    }
};

async function getOwnerFlats(req, res) {
    try {
        const flats = await Flat.find({ addedBy: req.profile._id });
        res.status(200).json({
            success: true,
            message: "Flats fetched successfully!",
            data: flats
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            error: "Error fetching flats: " + error.message,
        });
    }
};

module.exports = {
    addImage,
    addFlat,
    updateFlat,
    deleteFlat,
    getOwnerFlats
}