const mongoose = require('mongoose')
const { mailSender } = require('../config/nodemailer');

const {
    emailValidator,
} = require('../validator/modelValidator');

const OtpSchema = new mongoose.Schema({

    email: {
        type: String,
        require: true,
        validate: {
            validator: emailValidator,
            message: props => `${props.value} is not a valid email!`
        }
    },

    otp: {
        type: String,
        require: true,
        length: 6,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60 * 1000,
    }
})


OtpSchema.pre("save", async function (next) {

    async function sendVerificationMail(email, otp) {
        try {
            const mailResponse = await mailSender(email, otp);
        } catch (error) {
            throw error;
        }
    }

    await sendVerificationMail(this.email, this.otp);

    next();
})

module.exports = mongoose.model("Otp", OtpSchema)