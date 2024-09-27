const express = require("express")
const app = express();
const fileupload = require("express-fileupload")
const mongoose = require("mongoose")
// >>> security packages
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require("cors")
const csurf = require('csurf');
// >>> config packages
require('dotenv').config();
const connectDB = require("./config/database")
const connectCloudinary = require("./config/cloudinary")
// >>> routers
const AuthRouter = require("./routes/auth")
const CommentRouter = require("./routes/comment")
const FileRouter = require("./routes/file")
const FlatRouter = require("./routes/flat")
const HostelRouter = require("./routes/hostel")
const ProfileRouter = require("./routes/profile")
const LikesRouter = require("./routes/likes")
const FeaturedRouter = require("./routes/featured")
const FlatAdminRouter = require("./routes/flatadmin")
const HostelAdminRouter = require("./routes/hosteladmin")

// >> Importing Models
const Hostel = require("./models/Hostel")
const Flat = require("./models/Flat")
const NearestLandmarksForSearching = require("./models/NearestLandmarksForSearching")
const PriceAndSharing = require("./models/PriceAndSharing")
const Comment = require("./models/Comment")
const Like = require("./models/Like")
const Profile = require("./models/Profile")
const Otp = require("./models/Otp")
const PasswordResetToken = require("./models/PasswordResetToken")
const User = require("./models/User")


// >>> security middlewares 
app.use(cors("*"));

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
// app.use(csurf({ cookie: true }));


const limiter = rateLimit({
    max: 100000, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
    message: 'Too many requests' // message to send
});

app.use(limiter);


// >>> parser middlewares

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


// >>> use Routers 
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/profile", ProfileRouter)
app.use("/api/v1/flat", FlatRouter)
app.use("/api/v1/hostel", HostelRouter)
app.use("/api/v1/likes", LikesRouter)
app.use("/api/v1/comment", CommentRouter)
app.use("/api/v1/file", FileRouter)
app.use("/api/v1/featured", FeaturedRouter)
app.use("/api/v1/flatadmin", FlatAdminRouter)
app.use("/api/v1/hosteladmin", HostelAdminRouter)


// >>> starting and connecting with server and db
async function runServer() {
    try {
        // Connect to MongoDB
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        connectCloudinary();

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Listing on port ${process.env.PORT || 5000}`)
        })
    } catch (error) {
        console.log(`backend: ${error.message}`)
    }
}

runServer();