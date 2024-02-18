const mongoose = require("mongoose")


const CommentSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
        enum: ['flat', 'hostel'],
    },

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },

    comment: {
        type: String,
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },

}, { timestamps: true },
);

CommentSchema.pre('save', async function () {
    try {
        const Flat = require("./Flat")
        const Hostel = require("./Hostel")
        const Profile = require("./Profile")
        if (this.isNew) {
            if (this.type === 'flat') {
                this.hostel = undefined;
                await Flat.findOneAndUpdate(
                    { _id: this.flat },
                    {
                        $push: { comments: this._id },
                    },
                    { new: true, runValidators: true }
                )
            }

            if (this.type === 'hostel') {
                this.flat = undefined;
                await Hostel.findOneAndUpdate(
                    { _id: this.hostel },
                    {
                        $push: { comments: this._id },
                    },
                    { new: true, runValidators: true }
                )
            }

            await Profile.findOneAndUpdate(
                { _id: this.profile },
                {
                    $push: { comments: this._id },
                },
                { new: true, runValidators: true }
            )
        }
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});


CommentSchema.pre('remove', async function () {
    try {
        const Flat = require("./Flat")
        const Hostel = require("./Hostel")
        const Profile = require("./Profile")
        if (this.type === 'flat') {
            await Flat.findOneAndUpdate(
                { _id: this.flat },
                {
                    $pull: { comments: this._id },
                },
                { new: true, runValidators: true }
            )
        }

        if (this.type === 'hostel') {
            await Hostel.findOneAndUpdate(
                { _id: this.hostel },
                {
                    $pull: { comments: this._id },
                },
                { new: true, runValidators: true }
            )
        }

        await Profile.findOneAndUpdate(
            { _id: this.profile },
            {
                $pull: { comments: this._id },
            },
            { new: true, runValidators: true }
        )
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

module.exports = mongoose.model('Comment', CommentSchema)