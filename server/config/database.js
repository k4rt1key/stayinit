const mongoose = require('mongoose');

async function connectDB(URL) {
    const connect = await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = {connectDB};