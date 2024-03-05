const mongoose = require("mongoose")

const {
    emailValidator,
    phoneNumberValidator,
    linkValidator,
    pincodeValidator,
} = require('../validator/modelValidator');

require("dotenv").config();

const FlatSchema = new mongoose.Schema({

    // >>> mandatory fields

    type: {
        type: String,
        default: "flat",
        enum: ["flat"]
    },

    uniqueName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    name: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20,
    },

    developer: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 1000,
    },

    bhk: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },

    sqft: {
        type: Number,
        required: true,
        min: 100,
        max: 10000,
    },

    furnitureType: {
        type: String,
        enum: ["furnished", "unfurnished", "semifurnished"],
        required: true
    },

    images: [{
        type: String,
        validate: {
            validator: linkValidator,
            message: props => `${props.value} is not a valid url link!`
        }
    }],

    // >>> Address Fields -- mandatory

    address: {
        type: String,
        required: true,
        trim: true,
        min: 5,
        max: 200,
    },

    locality: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50,
    },

    city: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20,
    },

    pincode: {
        type: String,
        required: true,
        validate: {
            validator: pincodeValidator,
            message: props => `${props.value} is not a valid pincode!`
        },
    },

    addressLink: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 200,
        validate: {
            validator: linkValidator,
            message: props => `${props.value} is not a valid url link!`
        },
    },

    // >>> Address Fields -- optional
    nearestLandmarksForSearching: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "NearestLandmarksForSearching",
    }],

    // >>> Contact Fields -- mandatory
    contactNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: phoneNumberValidator,
            message: props => `${props.value} is not a valid phone number!`
        },
    },

    contactEmail: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: emailValidator,
            message: props => `${props.value} is not a valid email!`
        },
    },

    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },

    // >>> Optional Fields

    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
    },

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Like",
    },

    atWhichFloor: {
        type: Number,
        min: 0,
        max: 50,
    },

    totalFloor: {
        type: Number,
        min: 0,
        max: 50,
    },

    description: {
        type: String,
        trim: true,
        min: 10,
        max: 200,
    },

    bathrooms: {
        type: Number,
        min: 1,
        max: 10,
    },

    balconies: {
        type: Number,
        min: 0,
        max: 10,
    },

}, { timestamps: true })


FlatSchema.pre("save", async function () {

    if (this.isNew) {
        try {
            const Searching = require("./Searching")

            await Searching.create({ keyword: this.name, type: "hostel" })
            await Searching.create({ keyword: this.locality, type: "locality" })
            await Searching.create({ keyword: this.city, type: "city" })

        } catch (error) {
            throw new Error("backend: " + error.message)
        }
    }
});

FlatSchema.pre('remove', async function () {
    try {

        const Comment = require("./Comment")
        const Like = require("./Like")
        const NearestLandmarksForSearching = require("./NearestLandmarksForSearching")

        await NearestLandmarksForSearching.deleteMany({ _id: { $in: this.nearestLandmarksForSearching } })
        await Comment.deleteMany({ _id: { $in: this.comments } })
        await Like.deleteMany({ _id: { $in: this.likes } })
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

// FlatSchema.index({ '$**': 'text' });
FlatSchema.index({ 'city': 'text' });
FlatSchema.index({ 'locality': 'text' });
FlatSchema.index({ 'uniqueName': 'text' });
FlatSchema.index({ 'name': 'text' });


module.exports = mongoose.model("Flat", FlatSchema)
