const mongoose = require("mongoose")



const {
    emailValidator,
    phoneNumberValidator,
    linkValidator,
    pincodeValidator,
} = require('../validator/modelValidator');

const HostelSchema = new mongoose.Schema({

    // >>> mandatory fields
    name: {
        type: String,
        required: true,
        trim: true,
    },

    uniqueName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    developer: {
        type: String,
        required: true,
    },

    priceAndSharing: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "PriceAndSharing",
    },


    forWhichGender: {
        type: String,
        required: true,
        enum: ["boys", "girls", "both"],
    },

    images: [{
        type: String,
        validate: {
            validator: linkValidator,
            message: props => `${props.value} is not a valid url link!`
        }
    }],

    // >>> Address Fields -- mandatory
    addressLink: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: linkValidator,
            message: props => `${props.value} is not a valid url link!`
        },
    },

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
        required: true,
        type: String,
        validate: {
            validator: pincodeValidator,
            message: props => `${props.value} is not a valid pincode!`
        },
    },

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
            message: props => `${props.value} is not a valid contact number!`
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
        required: true,
        ref: "Profile",
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

    description: {
        type: String,
        trim: true,
        min: 10,
        max: 200,
    },

    liftFacility: Boolean,

    wifiFacility: Boolean,

    gymFacility: Boolean,

    acFacility: Boolean,

    gamingRoom: Boolean,

    freeLaundry: Boolean,

    securityGuard: Boolean,

    filterWater: Boolean,

    cctv: Boolean,

    cleaning: Boolean,

}, { timestamps: true })

HostelSchema.index({ '$**': 'text' });

HostelSchema.pre("remove", async function () {
    try {

        const Comment = require("./Comment")
        const Like = require("./Like")
        const NearestLandmarksForSearching = require("./NearestLandmarksForSearching")

        await Pricing.deleteMany({ hostel: this._id })
        await NearestLandmarksForSearching.deleteMany({ _id: { $in: this.nearestLandmarksForSearching } })
        await Comment.deleteMany({ hostel: this._id })
        await Like.deleteMany({ hostel: this._id })
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});


module.exports = mongoose.model("Hostel", HostelSchema)
