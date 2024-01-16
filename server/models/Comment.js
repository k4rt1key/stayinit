const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

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

module.exports = mongoose.model('Comment', commentSchema)