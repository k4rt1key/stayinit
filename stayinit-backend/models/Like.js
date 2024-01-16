const mongoose = require("mongoose")

const LikeSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },

    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
    },

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
    },

    type: {
        type: String,
        required: true,
        enum: ["hostel", "flat"],
    }

})

module.exports = mongoose.model("Like", LikeSchema)