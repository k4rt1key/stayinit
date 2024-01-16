const Comment = require('../models/Comment');
const Flat = require('../models/Flat');
const Hostel = require('../models/Hostel');
const Profile = require('../models/Profile');

async function addComment(req, res) {
    try {
        // getting variables fron request
        const { rating, comment, flat, hostel, type } = req.body;
        const { _id: profile } = req.profile;


        // checking if required fields are provided
        if (!rating || !(flat || hostel) || !profile || !type) {
            return res.status(400).json({
                success: false,
                message: "you did not provide all the required fields in request",
            });
        }

        // checking if type is valid and if the flat/hostel field is provided
        if ((type === "flat" && !flat) || (type === "hostel" && !hostel)) {
            return res.status(400).json({
                success: false,
                message: `For type '${type}', '${type}' id is required`,
            });
        }

        // deleting the previous comment if it exists
        const commentInDb = await Comment.findOne({
            profile: profile,
            flat: type === "flat" ? flat : undefined,
            hostel: type === "hostel" ? hostel : undefined,
        });

        // updating existing comment if it exists
        if (commentInDb) {
            const updatedComment = await commentInDb.updateOne({
                rating: rating,
                comment: comment,
            });

            return res.status(200).json({
                success: true,
                message: "your comment has been updated successfully",
                data: updatedComment,
            });
        }

        // creating a new comment if it does not exist
        const newComment = new Comment({
            rating: rating,
            comment: comment,
            flat: type === "flat" ? flat : undefined,
            hostel: type === "hostel" ? hostel : undefined,
            profile: profile,
            type: type,
        });

        await newComment.save();

        // pushing the new comment to profile's comments array
        await Profile.findOneAndUpdate(
            { _id: profile },
            { $push: { comments: newComment._id } },
            { new: true }
        );

        // pushing the new comment to properties's comments array
        if (type === "flat") {
            await Flat.findOneAndUpdate(
                { _id: flat },
                { $push: { comments: newComment._id } },
                { new: true }
            );
        }
        else if (type === "hostel") {
            await Hostel.findOneAndUpdate(
                { _id: hostel },
                { $push: { comments: newComment._id } },
                { new: true }
            );
        }

        res.status(201).json({
            success: true,
            message: "your comment has been added successfully",
            data: newComment,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function deleteComment(req, res) {

    try {

        // getting variables fron request
        const { commentId } = req.params;
        const { _id: profile } = req.profile;

        // basic validation and missing fields check
        if (!commentId) {
            return res.status(400).json({
                "success": false,
                "message": "you did not provide commentId in params",
            })
        }

        // deleting the comment
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        // removing the comment from profile's comments array
        await Profile.findOneAndUpdate(
            { _id: profile },
            { $pull: { comments: commentId } },
            { new: true }
        );

        // removing the comment from properties's comments array
        if (deletedComment.type === "flat") {
            await Flat.findOneAndUpdate(
                { _id: deletedComment.flat },
                { $pull: { comments: commentId } },
                { new: true }
            );
        }
        else if (deletedComment.type === "hostel") {
            await Hostel.findOneAndUpdate(
                { _id: deletedComment.hostel },
                { $pull: { comments: commentId } },
                { new: true }
            );
        }

        res.status(200).json({
            "success": true,
            "message": "your comment has been deleted successfully",
            "data": deletedComment
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

module.exports = {
    addComment,
    deleteComment
}

