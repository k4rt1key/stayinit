const Flat = require("../models/Flat")
const Image = require("../models/Image")
const Profile = require("../models/Profile")
const Comment = require("../models/Comment")
const Like = require("../models/Like")
const NearestLandmarksForSearching = require("../models/NearestLandmarksForSearching")

// get flat by unique name
async function getFlat(req, res) {
    try {

        const { flatname } = req.params

        if (!flatname) {
            return res.status(400).json({
                "success": false,
                "message": "you must provide flat-name",
            })
        }

        const flatInDb = await Flat.findOne({uniqueName: flatname})
            .populate("arrayOfImages comments likes nearestLandmarksForSearching")
            .populate({
                path: "comments",
                populate: {
                    path: "profile",
                }
            })


        if (!flatInDb) {
            return res.status(404).json({
                "success": false,
                "message": "your flat was not found",
            })
        }

        res.status(200).json({
            "success": true,
            "message": "your flat was found",
            "data": flatInDb
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function getAllFlats(req, res) {
    try {

        // getting filters and sorting options from request query 
        // then creating queryObject
        const { bhk, furnitureType } = req.query

        const minPrice = req.query.minPrice || 0
        const maxPrice = req.query.maxPrice || Infinity
        const minSqft = req.query.minSqft || 0
        const maxSqft = req.query.maxSqft || Infinity

        const sortByPrice = req.query.sortByPrice;
        const sortBySqft = req.query.sortBySqft;

        queryObj = {}

        if (bhk) {
            queryObj.bhk = bhk
        }

        if (furnitureType) {
            queryObj.furnitureType = furnitureType
        }

        // finding flats with the queryObject
        const flatsInDb = await Flat.find(queryObj)
            .populate("arrayOfImages comments likes nearestLandmarksForSearching")
            .sort(
                sortByPrice ? { "price": sortByPrice } : sortBySqft ? { "sqft": sortBySqft } : null
            )
            .where("price").gt(minPrice - 1).lt(maxPrice + 1)
            .where("sqft").gt(minSqft - 1).lt(maxSqft + 1)
            .exec()

        if (flatsInDb.length > 0) {
            return res.status(200).json({
                "success": true,
                "message": "your flats were fetched successfully",
                "data": flatsInDb
            })
        } else {
            return res.status(404).json({
                "success": false,
                "error": "no flats found",
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function addFlat(req, res) {
    try {
        // getting values from request
        const {
            type, name, uniqueName,price, bhk, sqft, furnitureType, address,
            locality, city, pincode, addressLink, nearestLandmarks,
            contactNumber, contactEmail, arrayOfImages, atWhichFloor,
            totalFloor, description, bathrooms,
            balconies, developer,
        } = req.body

        const { _id: profile } = req.profile;

        const newFlat = new Flat({
            type, name, uniqueName, price, bhk, sqft, furnitureType,
            address, locality, city, pincode, addressLink,
            nearestLandmarks, contactNumber, contactEmail,
            addedBy: profile, comments: [], likes: [], arrayOfImages: arrayOfImages || [], atWhichFloor,
            totalFloor, description, bathrooms, balconies, developer, 
            nearestLandmarksForSearching: []
        })

        await newFlat.save()

        res.status(201).json({
            "success": true,
            "message": "flat added successfully",
            "data": newFlat
        })
    }
    catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function deleteFlat(req, res) {
    try {
        const { id } = req.params
        const { _id: profile } = req.profile;

        if (!id) {
            return res.status(400).json({
                "success": false,
                "message": "flat-id is required",
            })
        }

        // then delete flat
        const deletedFlat = await Flat.findOneAndDelete({ _id: id, addedBy: profile })

        if (!deletedFlat) {
            return res.status(404).json({
                "success": false,
                "message": "flat not found",
            })
        }

        // delete comments, likes, images associated with the flat
        await Comment.deleteMany({ flat: id })

        await Like.deleteMany({ flat: id })

        await Image.deleteMany({ flatOrHostelId: id })

        // delete comments,likes in the user profile
        await Profile.findOneAndUpdate(
            { _id: profile },
            { $pull: { likes: { flat: id }, comments: { flat: id } } },
        )

        res.status(200).json({
            "success": true,
            "message": "flat deleted successfully",
            "data": deletedFlat
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function updateFlat(req, res) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                "success": false,
                "message": "flat-id is required",
            })
        }

        const editedFlat = await Flat.findByIdAndUpdate(
            id,
            updationObject,
            { new: true, runValidators: true }
        )

        if (!editedFlat) {
            return res.status(404).json({
                "success": false,
                "message": "flat could not be updated",
            })
        }

        res.status(200).json({
            "success": true,
            "message": "flat updated successfully",
            "data": editedFlat
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function addFlatImage(req, res) {
    try {
        // getting values from request
        const { url, propertyId, tags } = req.body

        const flatInDb = await Flat.findOne({ _id: propertyId })

        if (!flatInDb) {
            return res.status(404).json({
                "success": false,
                "message": "we could not find the flat you are looking for",
            })
        }

        // adding new image to the database
        const newFlatImage = new Image({ url, propertyId, tags })
        const createdFlatImage = await newFlatImage.save()

        // updating the flat to which the image is to be added
        await Flat.findOneAndUpdate(
            { _id: propertyId },
            { $push: { arrayOfImages: createdFlatImage._id } },
        )

        res.status(201).json({
            "success": true,
            "message": "your image has been added successfully",
            "data": createdFlatImage
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function addNearestLandmarks(req, res){

    try {
        const {distance, place, hostel, flat} = req.body;

        const newNearestLandmarkObject = new NearestLandmarksForSearching({
            distance,
            place,
            flat,
        });

        if(!newNearestLandmarkObject) {
            return res.status(500).json({
                "success": false,
                "message": "error in creating object"
            })
        }

        await newNearestLandmarkObject.save();

        await Flat.findByIdAndUpdate(
            flat,
            { $push: { nearestLandmarksForSearching: newNearestLandmarkObject._id} },
            { new: true}
        )

        res.status(200).json({
            "success": true,
            "message": "nearest landmark added successfully",
            "data": newNearestLandmarkObject,
        })

    } catch(error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }   
}

module.exports = {
    getFlat,
    getAllFlats,
    addFlat,
    deleteFlat,
    updateFlat,
    addFlatImage,
    addNearestLandmarks,
}
