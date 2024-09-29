const User = require("../models/User")
const Profile = require("../models/Profile")
const Otp = require("../models/Otp")
const PasswordResetToken = require("../models/PasswordResetToken")

const bcrypt = require("bcrypt")
const crypto = require("crypto")

require('dotenv').config();

async function login(req, res) {

    try {
        // getting variables fron request
        const { email, password } = req.body;

        // basic validation and missing fields check
        if (!(email && password)) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide both email & password",
            })
        }

        // user exists check
        const userInDb = await User.findOne({ email: email })

        if (!userInDb) {
            return res.status(404).json({
                "success": false,
                "message": "User not found, Register first to login",
            })
        }

        // compare plain-password & salted-password
        const isPasswordSame = await bcrypt.compare(password, userInDb.password)

        if (!isPasswordSame) {
            return res.status(401).json({
                "success": false,
                "message": "Incorrect password",
            })
        }

        // getting user profile
        const userProfile = await Profile.findOne({ userId: userInDb._id })

        const { accessToken, refreshToken } = await userInDb.generateRefreshAndAccessTokens();

        return res.status(200).json({
            "success": true,
            "token": accessToken,
            "refreshToken": refreshToken,
            "message": "Successfully logged in",
            "data": userProfile
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        });
    }
}

async function isAuthenticate(req, res) {

    try {
        const profile = req.profile;

        res.status(200).json({
            "success": true,
            "message": "Authenticated successfully",
            "data": profile
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        });
    }
}

async function register(req, res) {

    try {
        const {
            username,
            role,
            email,
            password,
            confirmPassword
        } = req.body;

        // check if all fields are provided
        if (!(username && email && password && confirmPassword)) {
            return res.status(400).json({
                "success": false,
                "message": "All fields are required",
            })
        }

        // check if password and confirm-password are same
        if (password !== confirmPassword) {
            return res.status(401).json({
                "success": false,
                "message": "Password and Confirm-password must be same",
            })
        }

        // check if password length is greater than 8
        if (password.length < 8) {
            return res.status(400).json({
                "success": false,
                "message": "Password's length must be greater than 8",
            })
        }

        // check if user already exists with given email 
        const userInDb = await User.findOne({ email: email })

        if (userInDb) {
            return res.status(409).json({
                "success": false,
                "message": "User is already exists with given email",
            });
        }

        // hash password
        const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))

        // create new user and save it to db
        const newUser = new User({
            username,
            role,
            email,
            password: hash,
        });


        await newUser.save();

        // create new profile and save it to db
        const profile = new Profile({
            userId: newUser._id,
            username,
            comments: [],
            likes: [],
        });

        await profile.save();

        // update user with profile id
        newUser.profile = profile._id;
        await newUser.save();

        res.status(201).json({
            "success": true,
            "message": "User registered successfully",
            "data": newUser
        });

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": `Backend: ${`backend: ${error.message}`}`,
        });
    }
}

async function sendOTP(req, res) {

    try {
        // getting variables fron request
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide email",
            })
        }

        // basic cheking and validation for email
        const emailInDB = await User.findOne({ email });

        if (emailInDB) {
            return res.status(409).json({
                "success": false,
                "message": "User already exists with given emai",
            })
        }

        // basic cheking and validation for Otp
        const otpInDB = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        if (otpInDB) {
            await otpInDB.deleteOne()
        }

        // generating a new Otp
        let digits = '0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        const newOTP = new Otp({
            email,
            otp
        });

        await newOTP.save();

        return res.status(201).json({
            "success": true,
            "message": `Otp is sent to : ${email}`,
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

async function verifyOTP(req, res) {

    try {
        // getting variables fron request
        const { email, otp } = req.body;

        // basic validation and missing fields check
        if (!email || !otp) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide both email & otp",
            })
        }

        const OTPinDb = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        // otp not found 
        if (!OTPinDb) {
            return res.status(404).json({
                "success": false,
                "message": "OTP not found or expired",
            })
        }

        // incorrect otp check
        if (otp !== OTPinDb.otp) {
            return res.status(400).json({
                "success": false,
                "message": "OTP is incorrect",
            })
        }

        // delete otp from db once it is verified
        await Otp.findByIdAndDelete(OTPinDb._id)

        res.status(200).json({
            "success": true,
            "message": "OTP verified successfully",
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

async function sendResetPasswordLink(req, res) {

    try {
        // getting variables fron request
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide email",
            })
        }

        // basic cheking and validation for user 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User is not registered with this email",
            })
        }

        //finding and deleting previous reset password token then creating new one
        const token = await PasswordResetToken.findOne({ email });

        if (token) {
            await token.deleteOne();
        }

        // generating a new reset password hash
        const resetPasswordHash = crypto.randomBytes(32).toString("hex");

        const resetPasswordToken = new PasswordResetToken({
            email: email,
            token: resetPasswordHash
        });

        await resetPasswordToken.save();

        res.status(200).json({
            "success": true,
            "message": `Reset password link sent successfully to : ${email}`,
        })

    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error status and the error message
        return res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

async function verifyResetPasswordLink(req, res) {

    try {
        // getting variables fron request
        const { password, confirmPassword, token, email } = req.body;

        // If password and confirmPassword are not provided, return a 400 Bad Request status
        if (!(password && confirmPassword)) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide both password & confirmPassword",
            })
        }

        // validate reset password token
        const tokenInDB = await PasswordResetToken.findOne({ email, token })

        if (!tokenInDB) {
            return res.status(404).json({
                "success": false,
                "message": "Token not found or expired",
            })
        }

        // check if password and confirm-password are same
        if (password !== confirmPassword) {
            return res.status(400).json({
                "success": false,
                "message": "Password and Confirm-password must be same",
            })
        }

        // hash the new password and update the user
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        // after password reset, delete the token from db
        await tokenInDB.deleteOne();

        res.status(200).json({
            "success": true,
            "message": "Password is reset successfully",
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

async function logout(req, res) {
    try {
        const profile = req.profile;

        const user = await User.findByIdAndUpdate(profile.userId, { $unset: { refreshToken: 1 } }, { new: true })

        res.status(200).json({
            "success": true,
            "message": "Logged out successfully",
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        });
    }
}

async function validateRefreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide refreshToken",
            })
        }

        const user = await User.findOne({ refreshToken })

        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found with given refreshToken",
            })
        }

        const { accessToken, refreshToken: newRefreshToken } = await user.generateRefreshAndAccessTokens();

        return res.status(200).json({
            "success": true,
            "message": "Successfully logged in with refreshToken",
            "token": accessToken,
            "refreshToken": newRefreshToken,
            "data": user.profile
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": `Backend: ${error.message}`,
        })
    }
}

module.exports = {
    login,
    isAuthenticate,
    register,
    sendOTP,
    verifyOTP,
    sendResetPasswordLink,
    verifyResetPasswordLink,
    logout,
    validateRefreshToken,
}
