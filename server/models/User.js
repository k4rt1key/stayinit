const mongoose = require("mongoose")

const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
    emailValidator,
    passwordValidator,
    phoneNumberValidator,
    usernameValidator,
} = require('../validator/modelValidator');

const UserSchema = new mongoose.Schema({

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
        enum: ["user", "admin", "property-owner"],
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


UserSchema.methods.generateRefreshAndAccessTokens = async function () {
    try {

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
                email: user.email,

            },

            process.env.JWT_SECRET,

            { expiresIn: process.env.JWT_EXPIRY }
        );

        user.refreshToken = refreshToken;
        await user.save();

        return { refreshToken, accessToken };
    } catch (error) {
        throw new Error(`backend: model: generateRefreshAndAccessTokens: ${error.message}`);
    }
}


// UserSchema.pre('save', async function () {
//     try {
//         const Comment = require("./Comment")
//         const Flat = require("./Flat")
//         const Hostel = require("./Hostel")
//         const Like = require("./Like")
//         const Profile = require("./Profile")

//         // if (this.isNew) {
//         //     const profile = await Profile.create({ userId: this._id, username: this.username });
//         //     this.profile = profile._id;
//         // }
//     } catch (error) {
//         throw new Error(`Backend: Model: Pre: Save: ${error.message}`);
//     }
// });

const handleDelete = async function () {
    try {
        const Comment = require("./Comment");
        const Flat = require("./Flat");
        const Hostel = require("./Hostel");
        const Like = require("./Like");
        const Profile = require("./Profile");

        await Comment.deleteMany({ profile: this.profile });
        await Like.deleteMany({ profile: this.profile });
        await Flat.deleteMany({ addedBy: this.profile });
        await Hostel.deleteMany({ addedBy: this.profile });

        await Profile.findOneAndDelete({ userId: this._id });
    } catch (error) {
        throw new Error(`Backend: Model: Pre: Delete: ${error.message}`);
    }
};

// Apply the pre middleware for deleteOne
UserSchema.pre('deleteOne', async function (next) {
    await handleDelete.call(this);
    next();
});

// Apply the pre middleware for deleteMany
UserSchema.pre('deleteMany', async function (next) {
    await handleDelete.call(this);
    next();
});

// Apply the pre middleware for findOneAndDelete
UserSchema.pre('findOneAndDelete', async function (next) {
    await handleDelete.call(this);
    next();
});

// Apply the pre middleware for remove
UserSchema.pre('remove', async function (next) {
    await handleDelete.call(this);
    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
