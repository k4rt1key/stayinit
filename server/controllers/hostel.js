const Hostel = require("../models/Hostel")
const PriceAndSharing = require("../models/PriceAndSharing")
const NearestLandmarksForSearching = require("../models/NearestLandmarksForSearching")

async function getHostel(req, res) {
    try {
        const { hostelname } = req.params

        const hostelInDb = await Hostel.findOne({ uniqueName: hostelname })
            .populate('priceAndSharing addedBy comments likes nearestLandmarksForSearching')
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
                "message": "Hostel not found",
            })
        }

        res.status(200).json({
            "success": true,
            "message": "Get hostel successful",
            "data": hostelInDb
        })

    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error status and the error message
        res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

async function getAllHostels(req, res) {
    try {
        // getting various filters and sorting options from request query
        const {
            forWhichGender,
            sortByPrice,
            search,
            priceRange,
            limit,
        } = req.query

        let minPrice = 0, maxPrice = Infinity
        if (priceRange == 1) {
            minPrice = 0;
            maxPrice = 40000;
        } else if (priceRange == 2) {
            minPrice = 40000;
            maxPrice = 80000;
        } else if (priceRange == 3) {
            minPrice = 80000;
            maxPrice = 120000;
        } else if (priceRange == 4) {
            minPrice = 120000;
            maxPrice = Infinity;
        }

        const queryObj = {}
        if (forWhichGender) {
            queryObj.forWhichGender = forWhichGender
        }

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: 'i' } },
                { uniqueName: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { locality: { $regex: search, $options: 'i' } }
            ];
        }

        const hostelsInDb = await Hostel
            .find(queryObj)
            .limit(parseInt(limit))
            .populate('priceAndSharing comments addedBy likes nearestLandmarksForSearching').exec()

        let response = hostelsInDb;

        // Filter hostels by price and then sort them
        const filteredData = response.filter((hostel) => {

            const priceAndSharingArray = hostel.priceAndSharing;

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
            "message": "All hostels fetched successfully",
            "data": filteredData
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

async function getFeaturedHostels(req, res) {
    try {
        const featuredHostels = await Hostel.find({ isFeatured: true })
            .populate('priceAndSharing addedBy comments likes nearestLandmarksForSearching')
            .exec()


        return res.status(200).json({
            "success": true,
            "message": "Featured hostels were fetched successfully",
            "data": featuredHostels
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}


module.exports = {
    getHostel,
    getAllHostels,
    getFeaturedHostels,
}
