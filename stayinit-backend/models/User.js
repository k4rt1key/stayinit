const mongoose = require('mongoose');
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


}, { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
