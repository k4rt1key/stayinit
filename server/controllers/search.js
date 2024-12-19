const Hostel = require("../models/Hostel");
const Flat = require("../models/Flat");

async function getCities(req, res) {
    try {
        // Fetch unique cities from both collections with type
        const hostelCities = await Hostel.distinct("city");
        const flatCities = await Flat.distinct("city");

        // Create pairs of { city, type }
        const hostelCityPairs = hostelCities.map(city => ({ city: city, type: "hostel" }));
        const flatCityPairs = flatCities.map(city => ({ city, type: "flat" }));

        // Combine all pairs
        const allCityPairs = [...hostelCityPairs, ...flatCityPairs];

        res.status(200).json({ success: true, data: allCityPairs });
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ error: "An error occurred while fetching cities." });
    }
}

module.exports = { getCities };
