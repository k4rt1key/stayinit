const Flat = require("../models/Flat")
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

        const flatInDb = await Flat.findOne({ uniqueName: flatname })
            .populate("comments likes nearestLandmarksForSearching")
            .populate({
                path: "comments",
                populate: {
                    path: "profile",
                }
            })


        if (!flatInDb) {
            return res.status(404).json({
                "success": false,
                "message": "flat was not found",
            })
        }

        res.status(200).json({
            "success": true,
            "message": "flat was found",
            "data": flatInDb
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": `backend: ${error.message}`,
        })
    }
}

async function getAllFlats(req, res) {
    try {

        // getting filters and sorting options from request query 
        // then creating queryObject
        const { bhk, furnitureType, search } = req.query

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

        if (search) {
            queryObj.$text = {
                $search: search,
            }
        }

        // finding flats with the queryObject
        const flatsInDb = await Flat.find(queryObj)
            .populate("comments likes nearestLandmarksForSearching")
            .sort(
                sortByPrice ? { "price": sortByPrice } : sortBySqft ? { "sqft": sortBySqft } : null
            )
            .where("price").gt(minPrice - 1).lt(maxPrice + 1)
            .where("sqft").gt(minSqft - 1).lt(maxSqft + 1)
            .exec()


        let response = flatsInDb;
        const newQueryObj = {};

        if (search) {
            newQueryObj.$text = { $search: search };


            const NL = await NearestLandmarksForSearching.find(newQueryObj);

            const FilteredNL = NL.filter((nearestLandmark) => {
                // if nearestLandmark is not associated with any flat then not adding it to the array
                // else adding it to the array if it's not already present in the flatsInDb
                if (nearestLandmark.flat) {
                    if (flatsInDb.length === 0) { return true; }
                    if (flatsInDb.find((flat) => flat._id.toString() !== nearestLandmark.flat.toString())) {
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
            const FlatsAssociatedWithNL = await Flat.find({ nearestLandmarksForSearching: { $in: FilteredNL } })
                .populate("comments likes nearestLandmarksForSearching")

            response = flatsInDb.concat(FlatsAssociatedWithNL);

        }

        return res.status(200).json({
            "success": true,
            "message": "flats were fetched successfully",
            "data": response
        })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": `backend: ${error.message}`,
        })
    }
}



module.exports = {
    getFlat,
    getAllFlats,
}
