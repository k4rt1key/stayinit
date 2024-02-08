const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
    emailValidator,
    passwordValidator,
    phoneNumberValidator,
    usernameValidator,
} = require('../validator/modelValidator');

const userSchema = new mongoose.Schema({

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
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

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailValidator,
            message: props => `${props.value} is not a valid email!`
        },
    },

    phoneNumber: {
        type: String,
        unique: true,
        validate: {
            validator: phoneNumberValidator,
            message: props => `${props.value} is not a valid contact number!`
        },
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: passwordValidator,
            message: props => `${props.value} is not a valid password!`
        },
    },

    refreshToken: {
        type: String,
        default: null,
    },

}, { timestamps: true }
);


userSchema.methods.generateRefreshAndAccessTokens = async function(){
    const user = this;

    const refreshToken = jwt.sign(
        {
            _id: user._id,
        },

        process.env.JWT_REFRESH_SECRET,

        { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );
    
    const accessToken = jwt.sign(
        {
            _id: user.profile,
            userId: user._id,
            username: user.username,
        },

        process.env.JWT_SECRET,

        { expiresIn: process.env.JWT_EXPIRY }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return { refreshToken, accessToken };
}

const User = mongoose.model("User", userSchema);
module.exports = User;
