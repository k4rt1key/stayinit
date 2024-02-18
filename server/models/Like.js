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

LikeSchema.pre("save", async function () {
    try {
        const Flat = require("./Flat")
        const Hostel = require("./Hostel")
        const Profile = require("./Profile")
        if (this.isNew) {
            if (this.type === "flat") {
                this.hostel = undefined
                await Flat.findOneAndUpdate(
                    { _id: this.flat },
                    {
                        $push: { likes: this._id },
                    },
                    { new: true, runValidators: true }
                )
            }

            if (this.type === "hostel") {
                this.flat = undefined
                await Hostel.findOneAndUpdate(
                    { _id: this.hostel },
                    {
                        $push: { likes: this._id },
                    },
                    { new: true, runValidators: true }
                )
            }

            await Profile.findOneAndUpdate(
                { _id: this.profile },
                {
                    $push: { likes: this._id },
                },
                { new: true, runValidators: true }
            )
        }
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

LikeSchema.pre("remove", async function () {
    try {
        const Flat = require("./Flat")
        const Hostel = require("./Hostel")
        const Profile = require("./Profile")
        if (this.type === "flat") {
            await Flat.findOneAndUpdate(
                { _id: this.flat },
                {
                    $pull: { likes: this._id },
                },
                { new: true, runValidators: true }
            )
        }
        if (this.type === "hostel") {
            await Hostel.findOneAndUpdate(
                { _id: this.hostel },
                {
                    $pull: { likes: this._id },
                },
                { new: true, runValidators: true }
            )
        }

        await Profile.findOneAndUpdate(
            { _id: this.profile },
            {
                $pull: { likes: this._id },
            },
            { new: true, runValidators: true }
        )
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

module.exports = mongoose.model("Like", LikeSchema)