const mongoose = require("mongoose")


const { resetPasswordMailSender } = require("../config/nodemailer");
const {
    emailValidator,
} = require('../validator/modelValidator');

const PasswordResetTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: emailValidator,
            message: props => `${props.value} is not a valid email!`
        },
        unique: true,
    },

    token: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 600,
    }
});


PasswordResetTokenSchema.pre("save", async function (next) {

    try {

        const User = require("./User")


        if (!await User.findOne({ email: this.email })) {
            throw new Error("User not found");
        }

        async function sendPasswordResetMail(email, token) {
            try {
                const mailResponse = await resetPasswordMailSender(email, token);
            } catch (error) {
                throw error;
            }
        }

        await sendPasswordResetMail(this.email, this.token);
        next();
    } catch (error) {
        throw new Error(`backend: ${error.message}`);
    }
});

module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);