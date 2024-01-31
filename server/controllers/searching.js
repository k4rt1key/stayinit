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
                "message": "Successfully fetched searched flat",
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
                "message": "Successfully fetched searched hostel",
                "data": response
            })
        }


        res.status(500).json({
            "success": false,
            "message": "Select a valid type (hostel or flat)",
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