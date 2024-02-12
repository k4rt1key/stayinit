const mongoose = require('mongoose')
const Pricing = require('./PriceAndSharing')

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

    // >>> Address Fields -- optional
    nearestLandmarks: {
        type: [String]
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

    arrayOfImages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Image"
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

HostelSchema.index({'$**': 'text'});

module.exports = mongoose.model("Hostel", HostelSchema)
