const Hostel = require("../models/Hostel")
const PriceAndSharing = require("../models/PriceAndSharing")
const NearestLandmarksForSearching = require("../models/NearestLandmarksForSearching")

async function getHostel(req, res) {
    try {
        const { hostelname } = req.params

        const hostelInDb = await Hostel.findOne({ uniqueName: hostelname })
            .populate('priceAndSharing comments likes nearestLandmarksForSearching')
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
            "message": `backend: ${error.message}`,
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

        const hostelsInDb = await Hostel
            .find()
            .populate('priceAndSharing comments likes nearestLandmarksForSearching').exec()

        let response = hostelsInDb;

        const newQueryObj = {};
        if (search) {
            newQueryObj.$text = { $search: search };

            const NL = await NearestLandmarksForSearching.find(newQueryObj);

            const FilteredNL = NL.filter((nearestLandmark) => {
                // if nearestLandmark is not associated with any flat then not adding it to the array
                // else adding it to the array if it's not already present in the hostelsInDb
                if (nearestLandmark.hostel) {
                    if (hostelsInDb.length === 0) { return true; }
                    if (hostelsInDb.find((hostel) => hostel._id.toString() !== nearestLandmark.hostel.toString())) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            });

            // now finding flats associated with the nearestLandmarks
            const HostelsAssociatedWithNL = await Hostel.find({ nearestLandmarksForSearching: { $in: FilteredNL } })
                .populate("comments priceAndSharing likes nearestLandmarksForSearching")

            response = hostelsInDb.concat(HostelsAssociatedWithNL);

        }

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
            "message": "all hostels fetched successfully",
            "data": filteredData
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `backend: ${error.message}`,
        })
    }
}

module.exports = {
    getHostel,
    getAllHostels,
}
