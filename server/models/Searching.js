const mongoose = require('mongoose');

const SearchingSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        // unique: true,
    },
    type: {
        type: String,
        required: true
    },
});


module.exports = mongoose.model('Searching', SearchingSchema);