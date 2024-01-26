const Hostel = require("../models/Hostel")
const PriceAndSharing = require("../models/PriceAndSharing")
const Image = require("../models/Image")
const NearestLandmarksForSearching = require("../models/NearestLandmarksForSearching")

async function getHostel(req, res) {
    try {
        const { hostelname } = req.params

        const hostelInDb = await Hostel.findOne({ uniqueName: hostelname })
            .populate('priceAndSharing comments likes arrayOfImages nearestLandmarksForSearching')
            .populate({
                path: "comments",
                populate: {
                    path: "profile",
                }
            })
            .exec()

        if (!hostelInDb) {
            return res.status(404).json({
                "success": false,
                "message": "hostel not found",
            })
        }

        res.status(200).json({
            "success": true,
            "message": "get hostel successful",
            "data": hostelInDb
        })

    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error status and the error message
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function getAllHostels(req, res) {
    try {
        // getting various filters and sorting options from request query
        const {
            forWhichGender,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
            sortByPrice,
            minPrice = 0,
            maxPrice = Infinity,
            search
        } = req.query

        const queryObj = {
            ...(liftFacility && { liftFacility }),
            ...(wifiFacility && { wifiFacility }),
            ...(gymFacility && { gymFacility }),
            ...(acFacility && { acFacility }),
            ...(gamingRoom && { gamingRoom }),
            ...(freeLaundry && { freeLaundry }),
            ...(securityGuard && { securityGuard }),
            ...(filterWater && { filterWater }),
            ...(cctv && { cctv }),
            ...(cleaning && { cleaning }),
            ...(forWhichGender && { forWhichGender })
        }

        if (search) {
            queryObj.$text = { $search: search }
        }

        const hostelsInDb = await Hostel.find(queryObj).populate('priceAndSharing comments likes arrayOfImages nearestLandmarksForSearching').exec()

        // Filter hostels by price and then sort them
        const filteredData = hostelsInDb.filter((hostel) => {
            const priceAndSharingArray = hostel.priceAndSharing
            const minPriceLocal = priceAndSharingArray.reduce((acc, curr) => Math.min(curr.price, acc), Infinity)
            const maxPriceLocal = priceAndSharingArray.reduce((acc, curr) => Math.max(curr.price, acc), 0)
            return (minPrice <= maxPriceLocal && maxPrice >= minPriceLocal)
        }).sort((hostelA, hostelB) => {
            const minPriceLocalA = hostelA.priceAndSharing.reduce((acc, curr) => Math.min(curr.price, acc), Infinity)
            const minPriceLocalB = hostelB.priceAndSharing.reduce((acc, curr) => Math.min(curr.price, acc), Infinity)
            return sortByPrice == 1 ? minPriceLocalA - minPriceLocalB : minPriceLocalB - minPriceLocalA
        })

        return res.status(200).json({
            "success": true,
            "message": "all hostels fetched successfully",
            "data": filteredData
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function addHostel(req, res) {
    try {
        const { // addedBy, likes, comments are by default added to [] in the model
            name,
            uniqueName,
            developer,
            priceAndSharing,
            forWhichGender,
            addressLink,
            address,
            locality,
            city,
            pincode,
            nearestLandmarks,
            contactNumber,
            contactEmail,
            arrayOfImages,
            description,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
        } = req.body

        const { _id: profile } = req.profile;

        const newHostel = new Hostel({
            name,
            priceAndSharing,
            developer,
            uniqueName,
            address,
            forWhichGender,
            addressLink,
            address,
            locality,
            city,
            pincode,
            contactNumber,
            contactEmail,
            addedBy: profile, // default
            nearestLandmarks: nearestLandmarks || [], // default
            comments: [], // default
            likes: [], // default
            arrayOfImages: arrayOfImages || [], // default
            description,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
            nearestLandmarksForSearching: [],
        })

        const createdHostel = await newHostel.save()

        if (createdHostel) {
            return res.status(201).json({
                "success": true,
                "message": "hostel added successfully",
                "data": createdHostel
            })
        } else {
            return res.status(400).json({
                "success": false,
                "message": "hostel not added",
            })
        }
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function deleteHostel(req, res) {
    try {
        const { id } = req.params

        const deletedHostel = await Hostel.findByIdAndDelete(id)

        if (deletedHostel) {
            return res.status(200).json({
                "success": true,
                "message": "hostel deleted successfully",
                "data": deletedHostel
            })
        } else {
            return res.status(404).json({
                "success": false,
                "message": "hostel not found",
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function updateHostel(req, res) {
    try {
        const { id } = req.params

        const updatedHostel = await Hostel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (updatedHostel) {
            return res.status(200).json({
                "success": true,
                "message": "hostel updated successfully",
                "data": updatedHostel
            })
        } else {
            return res.status(404).json({
                "success": false,
                "message": "hostel not found",
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function addPriceAndSharingDetails(req, res) {
    try {
        const { hostel, sharing, price } = req.body

        const hostelInDb = await Hostel.findOne({ _id: hostel })
        if (!hostelInDb) {
            return res.status(404).json({
                "success": false,
                "message": "hostel not found",
            })
        }

        const pricing = new PriceAndSharing({
            "hostel": hostel,
            "sharing": sharing,
            "price": price,
        })

        const createdPricing = await pricing.save()

        await Hostel.findOneAndUpdate(
            { _id: hostel },
            { $push: { priceAndSharing: createdPricing._id } },
        )

        res.status(201).json({
            "success": true,
            "message": "price and sharing added successfully",
            "data": createdPricing
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function addHostelImage(req, res) {
    try {

        const { propertyId, url, tags } = req.body


        const hostelInDb = await Hostel.findOne({ _id: propertyId })

        if (!hostelInDb) {
            return res.status(404).json({
                "success": false,
                "message": "hostel not found",
            })
        }

        const newImage = new Image({
            propertyId,
            url,
            tags: tags || [],
        })

        const createdImage = await newImage.save()

        await Hostel.findOneAndUpdate(
            { _id: propertyId },
            { $push: { arrayOfImages: createdImage._id } },
        )

        res.status(201).json({
            "success": true,
            "message": "image added successfully",
            "data": createdImage
        })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function addNearestLandmarks(req, res) {

    try {

        const { distance, place, hostel } = req.body;

        const newNearestLandmarkObject = new NearestLandmarksForSearching({
            distance,
            place,
            hostel,
        });

        if (!newNearestLandmarkObject) {
            return res.status(500).json({
                "success": false,
                "message": "error in creating object"
            })
        }

        await newNearestLandmarkObject.save();

        await Hostel.findByIdAndUpdate(
            hostel,
            { $push: { nearestLandmarksForSearching: newNearestLandmarkObject._id } },
            { new: true }
        )

        res.status(200).json({
            "success": true,
            "message": "nearest landmark added successfully",
            "data": newNearestLandmarkObject,
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}

module.exports = {
    getHostel,
    getAllHostels,
    addHostel,
    deleteHostel,
    updateHostel,
    addPriceAndSharingDetails,
    addHostelImage,
    addNearestLandmarks,
}
