const Flat = require('../../models/Flat');
const Hostel = require('../../models/Hostel');
const User = require('../../models/User');
const Likes = require('../../models/Like');
const Comment = require('../../models/Comment');
const Otp = require('../../models/Otp');
const PasswordResetToken = require('../../models/PasswordResetToken');
const PriceAndSharing = require('../../models/PriceAndSharing');
const Profile = require('../../models/Profile');

async function deleteFlat(req, res) {
    try {
        const { id } = req.params;
        const flat = await Flat.findById(id);


        if (!flat) {
            return res.status(404).json({ success: false, error: 'Flat not found' });
        }

        await flat.deleteOne();

        await Likes.deleteMany({ flat: id });
        await Comment.deleteMany({ flat: id });
        return res.status(200).json({ success: true, message: 'Flat deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function deleteHostel(req, res) {
    try {
        const { id } = req.params;
        const hostel = await Hostel.findById(id);


        if (!hostel) {
            return res.status(404).json({ success: false, error: 'Hostel not found' });
        }

        await hostel.deleteOne();

        await Likes.deleteMany({ hostel: id });
        await Comment.deleteMany({ hostel: id });
        await PriceAndSharing.deleteMany({ hostel: id });

        return res.status(200).json({ success: true, message: 'Hostel deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User({ _id: id });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        await user.deleteOne();
        await Likes.deleteMany({ user: id });
        await Comment.deleteMany({ user: id });
        await Profile.deleteMany({ user: id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { deleteFlat, deleteHostel, deleteUser };