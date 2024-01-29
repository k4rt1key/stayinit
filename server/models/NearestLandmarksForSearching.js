const mongoose = require("mongoose")

const NearestLandmarksForSearchingSchema = new mongoose.Schema({
    distance: {
        type: Number,
        require: true,
    },

    place: {
        type: String,
        require: true,
        text: true,
    },

    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
    },

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
    }
})


NearestLandmarksForSearchingSchema.index(
    {'$**': 'text'},
);

module.exports = mongoose.model("NearestLandmarksForSearching", NearestLandmarksForSearchingSchema)
