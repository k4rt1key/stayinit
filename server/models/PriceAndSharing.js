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

PricingSchema.pre("save", async function () {
    try {
        const Hostel = require("./Hostel")

        if (this.isNew) {
            await Hostel.findOneAndUpdate(
                { _id: this.hostel },
                {
                    $push: { priceAndSharing: this._id },
                },
                { new: true, runValidators: true }
            )
        }
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

PricingSchema.pre("remove", async function () {
    try {

        const Hostel = require("./Hostel")

        await Hostel.findOneAndUpdate(
            { _id: this.hostel },
            {
                $pull: { priceAndSharing: this._id },
            },
            { new: true, runValidators: true }
        )
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

module.exports = mongoose.model("PriceAndSharing", PricingSchema)
