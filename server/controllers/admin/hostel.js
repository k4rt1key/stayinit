const cloudinary = require('../../config/cloudinary');
const Hostel = require('../../models/Hostel');
const PriceAndSharing = require('../../models/PriceAndSharing');

async function addImage(req, res) {
    try {
        const hostel = await Hostel.findById(req.params.id);
        if (!hostel) {
            return res.status(404).json({
                success: false,
                error: "Hostel not found",
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

        uploadedImagePaths.forEach(path => hostel.images.push(path));

        const updatedHostel = await hostel.save();

        res.status(200).json({
            success: true,
            message: "Images added successfully!",
            data: updatedHostel,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Error adding image: " + error.message,
        });
    }
}

async function addHostel(req, res) {
    try {
        const newHostelObj = {
            type: "hostel",
            name: req.body.name,
            uniqueName: req.body.uniqueName,
            developer: req.body.developer,
            forWhichGender: req.body.forWhichGender,
            addressLink: req.body.addressLink,
            address: req.body.address,
            locality: req.body.locality,
            city: req.body.city,
            pincode: req.body.pincode,
            contactNumber: req.body.contactNumber,
            contactEmail: req.body.contactEmail,
            addedBy: req.profile._id,
            comments: [],
            likes: [],
            description: req.body.description,
            liftFacility: req.body.liftFacility,
            wifiFacility: req.body.wifiFacility,
            gymFacility: req.body.gymFacility,
            acFacility: req.body.acFacility,
            gamingRoom: req.body.gamingRoom,
            freeLaundry: req.body.freeLaundry,
            securityGuard: req.body.securityGuard,
            filterWater: req.body.filterWater,
            cctv: req.body.cctv,
            cleaning: req.body.cleaning,
            isFeatured: req.body.isFeatured
        }
        const newHostel = new Hostel(newHostelObj);
        const savedHostel = await newHostel.save();


        if (req.body.priceAndSharing && req.body.priceAndSharing.length > 0) {
            for (const priceAndSharing of req.body.priceAndSharing) {
                const priceAndSharingObj = new PriceAndSharing({
                    hostel: savedHostel._id,
                    sharing: priceAndSharing.sharing,
                    price: priceAndSharing.price
                });

                console.log(priceAndSharingObj);

                await priceAndSharingObj.save();

                console.log("Hostel after saving price and sharing:");
                console.log(await Hostel.findById(savedHostel._id));
            }
        }


        res.status(201).json({
            success: true,
            message: "Hostel added successfully!",
            data: savedHostel
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Error adding hostel: " + error.message
        });
    }
}

async function updateHostel(req, res) {
    try {
        const updationObj = {
            name: req.body.name,
            uniqueName: req.body.uniqueName,
            developer: req.body.developer,
            forWhichGender: req.body.forWhichGender,
            addressLink: req.body.addressLink,
            address: req.body.address,
            locality: req.body.locality,
            city: req.body.city,
            pincode: req.body.pincode,
            contactNumber: req.body.contactNumber,
            contactEmail: req.body.contactEmail,
            description: req.body.description,
            liftFacility: req.body.liftFacility,
            wifiFacility: req.body.wifiFacility,
            gymFacility: req.body.gymFacility,
            acFacility: req.body.acFacility,
            gamingRoom: req.body.gamingRoom,
            freeLaundry: req.body.freeLaundry,
            securityGuard: req.body.securityGuard,
            filterWater: req.body.filterWater,
            cctv: req.body.cctv,
            cleaning: req.body.cleaning,
            isFeatured: req.body.isFeatured
        }

        const updatedHostel = await Hostel.findByIdAndUpdate(
            req.params.id,
            updationObj,
            { new: true, runValidators: true }
        );
        if (!updatedHostel) {
            return res.status(404).json({
                success: false,
                error: "Hostel not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Hostel updated successfully!",
            data: updatedHostel
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Error updating hostel: " + error.message
        });
    }
}

async function deleteHostel(req, res) {
    try {
        const hostel = await Hostel.findById(req.params.id);
        if (!hostel) {
            return res.status(404).json({
                success: false,
                error: "Hostel not found"
            });
        }

        await hostel.deleteOne();
        res.status(200).json({
            success: true,
            message: "Hostel deleted successfully!"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Error deleting hostel: " + error.message
        });
    }
}

async function getOwnerHostels(req, res) {
    try {
        const hostels = await Hostel.find({ addedBy: req.profile._id }).populate('priceAndSharing');
        res.status(200).json({
            success: true,
            message: "Hostels fetched successfully!",
            data: hostels
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Error fetching hostels: " + error.message
        });
    }
}

module.exports = {
    addHostel,
    updateHostel,
    deleteHostel,
    getOwnerHostels,
    addImage
};
