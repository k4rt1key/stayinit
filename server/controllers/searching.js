const Hostel = require("../models/Hostel")
const Flat = require("../models/Flat")

async function searchProperties(req, res ) {

    try {
        const {
            search,
            type,
        } = req.query;

        // text --> this could be...
        //  flatName || hostelName
        //  flat's uniqueName || hostel's uniqueName
        //  flat's city, locality || hostel's city, locality,
        //  or can be in NearestLandmarks

        let response = [];


        if (type === "flat") {
            const searchByFlat = await Flat.find({ $text: { $search: search }});
            // const searchByNearestLandmarks = await Flat.find({ nearestLandmarksForSearching: { place: new RegExp(search, "i") } });

            if (searchByFlat) {
                response = response = response.concat(searchByFlat);
            }

            // if (searchByNearestLandmarks) {
            //     response.concat(searchByNearestLandmarks)
            // }

            return res.status(200).json({
                "success": true,
                "message": "searched flats fetched successfully",
                "data": response
            })
        }

        if (type === "hostel") {
            const searchByHostel = await Hostel.find({ $text: { $search: search}});
            // const searchByNearestLandmarks = await Hostel.find({ nearestLandmarksForSearching: { place: new RegExp(search, "i") } });

            if (searchByHostel) {
                response = response.concat(searchByHostel);
            }

            // if (searchByNearestLandmarks) {
            //     response.concat(searchByNearestLandmarks)
            // }

            return res.status(200).json({
                "success": true,
                "message": "searched hostel fetched successfully",
                "data": response
            })
        }


        res.status(500).json({
            "success": false,
            "message": "please select flat or hostel as catagory or some Error"
        })

    } catch(error){
        res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
   
}

module.exports = {
    searchProperties
}