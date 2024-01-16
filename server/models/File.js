const mongoose = require("mongoose");

const {
    linkValidator,
} = require('../validator/modelValidator');

FileSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 20,
    },

    url: {
        type: String,
        validation: {
            validator: linkValidator,
            message: props => `${props.value} is not a valid url link!`
        }
    },

    tags: {
        type: [String],
    }
})

module.exports = mongoose.model("File", FileSchema)