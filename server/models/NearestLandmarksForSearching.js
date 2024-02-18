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
    { '$**': 'text' },
);

NearestLandmarksForSearchingSchema.pre("save", async function () {
    try {
        const Flat = require("./Flat")
        const Hostel = require("./Hostel")
        if (this.isNew) {
            if (this.flat) {
                this.hostel = undefined;

                await Flat.findOneAndUpdate(
                    { _id: this.flat },
                    {
                        $push: { nearestLandmarksForSearching: this._id },
                    },
                    { new: true, runValidators: true }
                )
            }

            if (this.hostel) {
                this.flat = undefined;

                await Hostel.findOneAndUpdate(
                    { _id: this.hostel },
                    {
                        $push: { nearestLandmarksForSearching: this._id },
                    },
                    { new: true, runValidators: true }
                )
            }
        }
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});


NearestLandmarksForSearchingSchema.pre('remove', async function () {
    try {
        const Flat = require("./Flat")
        const Hostel = require("./Hostel")
        if (this.flat) {
            await Flat.findOneAndUpdate(
                { _id: this.flat },
                {
                    $pull: { nearestLandmarksForSearching: this._id },
                },
                { new: true, runValidators: true }
            )
        }

        if (this.hostel) {
            await Hostel.findOneAndUpdate(
                { _id: this.hostel },
                {
                    $pull: { nearestLandmarksForSearching: this._id },
                },
                { new: true, runValidators: true }
            )
        }
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }

})

module.exports = mongoose.model("NearestLandmarksForSearching", NearestLandmarksForSearchingSchema)
