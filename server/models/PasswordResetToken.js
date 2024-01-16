const mongoose = require("mongoose");
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

    async function sendPasswordResetMail(email, token) {
        try {
            const mailResponse = await resetPasswordMailSender(email, token);
        } catch (error) {
            throw error;
        }
    }

    await sendPasswordResetMail(this.email, this.token);
    next();
});

module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);