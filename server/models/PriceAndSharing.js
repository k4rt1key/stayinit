const mongoose = require("mongoose")

const PricingSchema = new mongoose.Schema({

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Hostel",
    },

    sharing: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },

    price: {
        type: Number,
        required: true,
        min: 1000,
    }
})

module.exports = mongoose.model("PriceAndSharing", PricingSchema)
