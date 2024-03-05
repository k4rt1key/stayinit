const Searching = require('../models/Searching');

async function searchCity(req, res) {

    try {

        const searching = await Searching.find({ type: "city" });

        res.status(200).json({
            "success": true,
            "message": "searching data retrieved successfully",
            "data": searching,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `backend: ${error.message}`
        })
    }

}

async function searchLocality(req, res) {

    try {

        const searching = await Searching.find({ type: "locality" });

        res.status(200).json({
            "success": true,
            "message": "searching data retrieved successfully",
            "data": searching,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `backend: ${error.message}`
        })
    }

}

module.exports = {
    searchCity,
    searchLocality,
}