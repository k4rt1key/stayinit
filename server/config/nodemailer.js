const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

async function mailSender(email, otp) {

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verification email from Stayinit",
        text: 'Your one time password ( OTP ) is ' + otp + '. This OTP will expire in 5 minutes.'
    };

    await transporter.sendMail(mailOptions)
        .catch(function (error) {
            console.log(error);
        });
}

async function resetPasswordMailSender(email, token) {

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password email from Stayinit",
        text: 'Here is your password reset link:  ' + `http://localhost:3000/user/reset-password?token=${token}&email=${email}` + ' . This Link will expire in 5 minutes.'
    };

    await transporter.sendMail(mailOptions)
        .catch(function (error) {
            console.log(error);
        });
}

module.exports = {
    mailSender,
    resetPasswordMailSender
}