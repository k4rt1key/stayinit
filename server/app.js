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

// >>> Admin Panel
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

// Register the Mongoose adapter for AdminBro
AdminBro.registerAdapter(AdminBroMongoose);

// Create an AdminBro instance and add the Hostel schema as a resource
const adminBro = new AdminBro({
    resources: [
        // Hostel
        {
            resource: Hostel,
            options: {
                properties: {
                    priceAndSharing: {
                        type: 'reference',
                        reference: 'PriceAndSharing',
                    },
                    nearestLandmarksForSearching: {
                        type: 'reference',
                        reference: 'NearestLandmarksForSearching',
                    },

                    comments: {
                        type: 'reference',
                        reference: 'Comment',
                    },
                    likes: {
                        type: 'reference',
                        reference: 'Like',
                    },
                    addedBy: {
                        type: 'reference',
                        reference: 'Profile',
                    },
                }
            }
        },

        // Flat
        {
            resource: Flat,
            options: {
                properties: {
                    nearestLandmarksForSearching: {
                        type: 'reference',
                        reference: 'NearestLandmarksForSearching',
                    },

                    comments: {
                        type: 'reference',
                        reference: 'Comment',
                    },
                    likes: {
                        type: 'reference',
                        reference: 'Like',
                    },
                    addedBy: {
                        type: 'reference',
                        reference: 'Profile',
                    },
                }
            }
        },

        // NearestLandmarksForSearching
        {
            resource: NearestLandmarksForSearching,
            options: {
                properties: {
                    flat: {
                        type: 'reference',
                        reference: 'Flat',
                    },
                    hostel: {
                        type: 'reference',
                        reference: 'Hostel',
                    }
                }
            }
        },

        // PriceAndSharing
        {
            resource: PriceAndSharing,
            options: {
                properties: {
                    hostel: {
                        type: 'reference',
                        reference: 'Hostel',
                    }
                }
            }
        },

        // Comment
        {
            resource: Comment,
            options: {
                properties: {
                    hostel: {
                        type: 'reference',
                        reference: 'Hostel',
                    },
                    flat: {
                        type: 'reference',
                        reference: 'Flat',
                    },
                    profile: {
                        type: 'reference',
                        reference: 'Profile',
                    }
                }
            }
        },

        // Like
        {
            resource: Like,
            options: {
                properties: {
                    hostel: {
                        type: 'reference',
                        reference: 'Hostel',
                    },
                    flat: {
                        type: 'reference',
                        reference: 'Flat',
                    },
                    profile: {
                        type: 'reference',
                        reference: 'Profile',
                    }
                }
            }
        },

        // Profile
        {
            resource: Profile,
            options: {
                properties: {
                    userId: {
                        type: 'reference',
                        reference: 'User',
                    },
                    comments: {
                        type: 'reference',
                        reference: 'Comment',
                    },
                    likes: {
                        type: 'reference',
                        reference: 'Like',
                    }

                }
            },
        },

        // Otp
        {
            resource: Otp,
        },

        // PasswordResetToken
        {
            resource: PasswordResetToken,
        },

        // User
        {
            resource: User,
            options: {
                properties: {
                    profile: {
                        type: 'reference',
                        reference: 'Profile',
                    }
                }
            }
        },

    ],
});

// Build the AdminBro router and add it to the Express app
const adminRouter = AdminBroExpress.buildRouter(adminBro);
app.use(adminBro.options.rootPath, adminRouter);

// >>> security middlewares 
app.use(cors("*"))
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


// >>> starting and connecting with server and db
async function runServer() {
    try {
        // Connect to MongoDB
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        connectCloudinary();

        // Initialize AdminBro
        await adminRouter;

        app.use(adminBro.options.rootPath, adminRouter);

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Listing on port ${process.env.PORT || 5000}`)
        })
    } catch (error) {
        console.log(`backend: ${error.message}`)
    }
}

runServer();