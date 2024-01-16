const mongoose = require("mongoose");
const {
    usernameValidator,
    linkValidator,
} = require('../validator/modelValidator');

const ProfileSchema = new mongoose.Schema({

    // >>> mandatory fields
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },


    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: usernameValidator,
            message: props => `${props.value} is not a valid username`
        }
    },

    // >>> optional fields
    firstname: String,

    lastname: String,

    profilePiture: {
        // default: "https://res.cloudinary.com/djnv06fje/image/upload/v1621455192/Hostel-Management-Project/defaultProfilePicture_zzq4qj.png",
        type: String,
        validate: {
            validator: linkValidator,
            message: props => `${props.value} is not a valid url link!`
        }
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Like"
    },

}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
