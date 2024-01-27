const User = require("../models/User")
const Profile = require("../models/Profile")
const Otp = require("../models/Otp")
const PasswordResetToken = require("../models/PasswordResetToken")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
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
                "message": "you did not provide email or password",
            })
        }

        // user exists check
        const userInDb = await User.findOne({ email })

        if (!userInDb) {
            return res.status(404).json({
                "success": false,
                "message": "user is not registered with this email",
            })
        }

        // compare plain-password & salted-password
        const isPasswordSame = await bcrypt.compare(password, userInDb.password)

        if (!isPasswordSame) {
            return res.status(401).json({
                "success": false,
                "message": "password is incorrect",
            })
        }

        // getting user profile
        const userProfile = await Profile.findOne({ userId: userInDb._id })

        const {accessToken, refreshToken} = await userInDb.generateRefreshAndAccessTokens();

        return res.status(200).json({
            "success": true,
            "token": accessToken,
            "refreshToken": refreshToken,
            "message": "you are logged in successfully",
            "data": userProfile
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function isAuthenticate(req, res) {

    try {
        const profile = req.profile;

        res.status(200).json({
            "success": true,
            "message": "authenticated successfully",
            "data": profile
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function register(req, res) {

    try {
        const {
            username,
            role,
            email,
            phoneNumber,
            password,
            confirmPassword
        } = req.body;

        // check if all fields are provided
        if (!(username && email && password && confirmPassword)) {
            return res.status(400).json({
                "success": false,
                "message": "all fields are required",
            })
        }

        // check if password and confirm-password are same
        if (password !== confirmPassword) {
            return res.status(401).json({
                "success": false,
                "message": "password and confirm-password are not same",
            })
        }

        // check if password length is greater than 8
        if (password.length < 8) {
            return res.status(400).json({
                "success": false,
                "message": "password length must be greater than 8",
            })
        }

        // check if user already exists with given email 
        const userInDb = await User.findOne({ email })

        if (userInDb) {
            return res.status(409).json({
                "success": false,
                "message": "user already exists with given email",
            });
        }

        // hash password
        const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))

        // create new user and save it to db
        const newUser = new User({
            username,
            role,
            email,
            phoneNumber,
            password: hash
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

        res.status(201).json({
            "success": true,
            "message": "you are registered successfully",
            "data": newUser
        });

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
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
                "message": "email is required",
            })
        }

        // basic cheking and validation for email
        const emailInDB = await User.findOne({ email });

        if (emailInDB) {
            return res.status(409).json({
                "success": false,
                "message": "you are already registered with this email",
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
            "message": "otp is created successfully",
            "data": newOTP
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
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
                "message": "you did not provide email or otp",
            })
        }

        const OTPinDb = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        // otp not found 
        if (!OTPinDb) {
            return res.status(404).json({
                "success": false,
                "message": "we don't have any otp for this email",
            })
        }

        // incorrect otp check
        if (otp !== OTPinDb.otp) {
            return res.status(400).json({
                "success": false,
                "message": "either otp is incorrect or expired",
            })
        }

        // delete otp from db once it is verified
        await Otp.findByIdAndDelete(OTPinDb._id)

        res.status(200).json({
            "success": true,
            "message": "otp verified successfully",
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
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
                "message": "email is required",
            })
        }

        // basic cheking and validation for user 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "user is not registered with this email",
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
            "message": "reset password link sent successfully",
        })

    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error status and the error message
        return res.status(500).json({
            "success": false,
            "message": error.message,
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
                "message": "password and confirm-password are required",
            })
        }

        // validate reset password token
        const tokenInDB = await PasswordResetToken.findOne({ email, token })

        if (!tokenInDB) {
            return res.status(404).json({
                "success": false,
                "message": "given token is not valid or expired",
            })
        }

        // check if password and confirm-password are same
        if (password !== confirmPassword) {
            return res.status(400).json({
                "success": false,
                "message": "password and confirm-password are not same",
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
            "message": "your password is reset successfully",
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function logout(req,res){
    try {
        const profile = req.profile;

        const user = await User.findById(profile.userId)
        user.refreshToken = null;
        await user.save();

        res.status(200).json({
            "success": true,
            "message": "you are logged out successfully",
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function validateRefreshToken(req,res){
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                "success": false,
                "message": "refreshToken is required",
            })
        }

        const user = await User.findOne({ refreshToken })

        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "user not found",
            })
        }

        const {accessToken, refreshToken: newRefreshToken} = await user.generateRefreshAndAccessTokens();

        return res.status(200).json({
            "success": true,
            "message": "token is validated successfully",
            "token": accessToken,
            "refreshToken": newRefreshToken,
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
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
