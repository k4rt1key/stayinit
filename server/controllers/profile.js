const Profile = require("../models/Profile");
const User = require("../models/User");

const getOneProfile = async (req, res) => {
    try {
        // getting profileId from request params
        const { profileId } = req.params;

        // missing variable check
        if (!profileId) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide profileId",
            });
        }

        // getting profile from database and returning response
        const profileInDb = await Profile.findById(profileId);
        if (!profileInDb) {
            return res.status(404).json({
                "success": false,
                "message": "Profile not found",
            });
        }

        res.status(200).json({
            "success": true,
            "message": "Successfully fetched profile",
            "data": profileInDb,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `backend: ${error.message}`,
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        // getting data from request
        const { _id: profile } = req.profile;

        const {
            username,
            firstname,
            lastname,
            profilePiture
        } = req.body;


        // updating the profile
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: profile },
            req.body,
            { new: true }
        )

        if (username) {
            await User.findOneAndUpdate(
                { profile: profile },
                { username: username },
                { new: true });
        }

        res.status(200).json({
            "success": true,
            "message": "Profile has been updated successfully",
            "data": updatedProfile,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": `backend: ${error.message}`,
        });
    }
}


module.exports = {
    getOneProfile,
    updateProfile,
}