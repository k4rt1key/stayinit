const Flat = require("../models/Flat")
const NearestLandmarksForSearching = require("../models/NearestLandmarksForSearching")

// get flat by unique name
async function getFlat(req, res) {
    try {

        const { flatname } = req.params

        if (!flatname) {
            return res.status(400).json({
                "success": false,
                "message": "You must provide flat-name",
            })
        }

        const flatInDb = await Flat.findOne({ uniqueName: flatname })
            .populate("comments likes addedBy nearestLandmarksForSearching")
            .populate({
                path: "comments",
                populate: {
                    path: "profile",
                }
            })


        if (!flatInDb) {
            return res.status(404).json({
                "success": false,
                "message": "Flat not found",
            })
        }

        res.status(200).json({
            "success": true,
            "message": "Flat not found",
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
        let { bhk, furnitureType, search, priceRange, sqftRange, city, locality, limit, page } = req.query

        if (!page || page == 0) {
            page = 1;
        }

        if (!limit || limit == 0) {
            limit = 9;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let minSqft = 0, maxSqft = Infinity, minPrice = 0, maxPrice = Infinity;
        if (priceRange === "1") {
            minPrice = 0;
            maxPrice = 10000;
        }
        if (priceRange === "2") {
            minPrice = 10000;
            maxPrice = 20000;
        }
        if (priceRange === "3") {
            minPrice = 20000;
            maxPrice = 30000;
        }
        if (priceRange === "4") {
            minPrice = 30000;
            maxPrice = Infinity;
        }


        if (sqftRange === "1") {
            minSqft = 0;
            maxSqft = 500;
        }
        if (sqftRange === "2") {
            minSqft = 500;
            maxSqft = 1000;
        }
        if (sqftRange === "3") {
            minSqft = 1000;
            maxSqft = 1500;
        }
        if (sqftRange === "4") {
            minSqft = 1500;
            maxSqft = 2000;
        }
        if (sqftRange === "5") {
            minSqft = 2000;
            maxSqft = Infinity;
        }

        const sortByPrice = req.query.sortByPrice;
        const sortBySqft = req.query.sortBySqft;

        queryObj = {}

        if (city) {
            queryObj.city = city.toLowerCase()
        }

        if (locality) {
            queryObj.locality = locality.toUpperCase()
        }

        if (bhk) {
            queryObj.bhk = bhk
        }

        if (furnitureType) {
            queryObj.furnitureType = furnitureType
        }

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: 'i' } },
                { uniqueName: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { locality: { $regex: search, $options: 'i' } }
            ];
        }


        const flatsInDb = await Flat.find(queryObj)
            .populate("likes")
            .where("price").gt(minPrice - 1).lt(maxPrice + 1)
            .where("sqft").gt(minSqft - 1).lt(maxSqft + 1)
            .sort(
                sortByPrice ? { "price": sortByPrice } : sortBySqft ? { "sqft": sortBySqft } : null
            )
            .skip(skip)
            .limit(limit)
            .exec()

        return res.status(200).json({
            "success": true,
            "message": "Flats were fetched successfully",
            "data": flatsInDb
        })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": `Backend: ${error.message}`,
        })
    }
}

async function getFeaturedFlats(req, res) {
    try {
        const featuredFlats = await Flat.find({ isFeatured: true })
            .populate("likes")
            .exec()

        return res.status(200).json({
            "success": true,
            "message": "Featured Flats were fetched successfully",
            "data": featuredFlats
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": `Backend: ${error.message}`,
        })
    }
}



module.exports = {
    getFlat,
    getAllFlats,
    getFeaturedFlats,
}
