const Like = require("../models/Like")
const Profile = require("../models/Profile")
const Flat = require("../models/Flat")
const Hostel = require("../models/Hostel")

async function like(req, res) {
    try {

        // getting variables fron request 
        const {
            type,
            propertyId,
        } = req.body;

        const { _id: profile } = req.profile;


        // basic missing value check
        if (!type || !propertyId) {
            return res.status(400).json({
                "success": false,
                "message": "you did not provide all the required fields in request",
            });
        }

        // basic validation of type
        if (type !== "flat" && type !== "hostel") {
            return res.status(400).json({
                "success": false,
                "message": "unknown type of property, type must be flat or hostel",
            });
        }


        // add like if not already liked
        const likeInDb = await Like.findOne({
            profile: profile,
            flat: type === "flat" ? propertyId : undefined,
            hostel: type === "hostel" ? propertyId : undefined,
            type: type,
        });

        if (likeInDb) {
            return res.status(409).json({
                "success": false,
                "message": "user has already liked this property",
            });
        }

        const newLike = new Like({
            profile: profile,
            flat: type === "flat" ? propertyId : undefined,
            hostel: type === "hostel" ? propertyId : undefined,
            type: type,
        });

        await newLike.save();


        // push like to profile's likes array
        await Profile.findOneAndUpdate(
            { _id: profile },
            { $push: { likes: newLike._id } },
            { new: true }
        )

        // push like to property's likes array
        if (type === "flat") {
            await Flat.findOneAndUpdate(
                { _id: propertyId },
                { $push: { likes: newLike._id } },
                { new: true }
            )
        }
        else if (type === "hostel") {
            await Hostel.findOneAndUpdate(
                { _id: propertyId },
                { $push: { likes: newLike._id } },
                { new: true }
            )
        }

        res.status(200).json({
            "success": true,
            "message": "you have liked this property",
            "data": newLike
        });

    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error status and the error message
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function getLikedProperties(req, res) {
    try {

        // getting variables fron request
        const { _id: profile } = req.profile;

        // find all likes of the given profile
        const likesInDb = await Like.find({ profile })
            .populate({
                path: 'flat',
                populate: { path: 'arrayOfImages' }
            })
            .populate({
                path: 'hostel',
                populate: { path: 'arrayOfImages' }
            });

        res.status(200).json({
            "success": true,
            "message": "successfully fetched all liked properties",
            "data": likesInDb,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function unlike(req, res) {
    try {
        // getting variables fron request
        const {
            type,
            propertyId
        } = req.params;

        const { _id: profile } = req.profile;

        // basic missing value check
        if (!type || !propertyId) {
            return res.status(400).json({
                "success": false,
                "message": "you did not provide all the required fields in request",
            });
        }

        // basic validation of type
        if (type !== "flat" && type !== "hostel") {
            return res.status(400).json({
                "success": false,
                "message": "unknown type of property, type must be flat or hostel",
            });
        }

        // delete like if it exists
        const likeInDb = await Like.findOne({
            profile: profile,
            flat: type === "flat" ? propertyId : undefined,
            hostel: type === "hostel" ? propertyId : undefined,
            type: type,
        });

        if (!likeInDb) {
            return res.status(404).json({
                "success": false,
                "message": "user has not liked this property",
            });
        }

        // remove like from profile's likes array
        await Profile.findOneAndUpdate(
            { _id: profile },
            { $pull: { likes: likeInDb._id } },
            { new: true }
        )

        // remove like from property's likes array
        if (type === "flat") {
            await Flat.findOneAndUpdate(
                { _id: propertyId },
                { $pull: { likes: likeInDb._id } },
                { new: true }
            )
        }
        else if (type === "hostel") {
            await Hostel.findOneAndUpdate(
                { _id: propertyId },
                { $pull: { likes: likeInDb._id } },
                { new: true }
            )
        }

        // now unlike the property
        await likeInDb.deleteOne();

        res.status(200).json({
            "success": true,
            "message": "property unliked successfully",
            "data": likeInDb
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

module.exports = { like, getLikedProperties, unlike }