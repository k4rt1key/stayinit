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
        subject: "Stayinit.in: Your One-Time Password (OTP)",
        text: `
        Dear [user],

        Thank you for using Stayinit.in.To ensure the security of your account, we have sent you a one- time password (OTP) that is valid for the next 5 minutes.

        Your OTP is: ${otp}

        Please enter this code in the OTP field when prompted to complete the verification process.

        If you did not request this OTP, please ignore this message and contact us immediately.

        Best regards, The Stayinit.in Team

    `

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
        text: 'Here is your password reset link:  ' + `${process.env.FRONTEND_URL}/user/reset-password?token=${token}&email=${email}` + ' . This Link will expire in 5 minutes.'
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