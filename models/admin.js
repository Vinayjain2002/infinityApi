const mongoose= require("mongoose")

const adminSchema= mongoose.Schema({
    deletedAdminAccount: {
        type: Boolean,
        default: false
    },
    adminname: {
        type: String,
        trim: tr-ue,
        required: true,
        lowercase: true,
        unique: true
    },
    adminemail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    accessAppliedFor: [
        {
            type: String
        }
    ],
    adminProfilePicture: {
        type: String
    },
    adminCoverPicture: {
        type: String
    },
    adminPasswordToken: {
        type: String
    },
    adminMobileToken: {
        type: String
    },
    adminBio: {
        type:String
    },
    adminTechStack: [
        {
            type: String
        }
    ],
    approvedadmin: {
        type: Boolean,
        default: false
    },
    createOtherAdmin: {
        type: Boolean,
        default: false,
    },
    adminmobileno: {
        type: Number,
        required: true,
        lowercase: true
    },
    adminpassword: {
        type:String,
        required: true
    },
    userAccess: {
        type: Boolean,
        default: false
    },
    bloggerAccess: {
        type: Boolean,
        default: false
    },
    tutorAccess: {
        type: Boolean,
        default: false
    },
    blogsAccess: {
        type: Boolean,
        default: false
    },
    videoAccess: {
        type: Boolean,
        default: false
    },
    hackathonsAccess: {
        type: Boolean,
        deafult: false
    },
    eventAccess: {
        type: Boolean,
        default: false
    },
    bootcampAccess: {
        type: Boolean,
        default: false
    },
    announcementAccess: {
        type: Boolean,
        default: false
    },
    festAccess: {
        type: Boolean,
        default: false
    },
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    deletedUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    accessedUserAccount: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    addedCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training"
        }
    ],
    blockedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    addedVideo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    deletedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    blockedCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training"
        }
    ],
    deletedCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training"
        }
    ],
    createdBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blogs"
        }
    ],
    deletedBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blogs"
        }
    ],
    createdFests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fest"
        }
    ],
    deletedFests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fest"
        }
    ],
    createdBootcamps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bootcamp"
        }
    ],
    deletedBootcamps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bootcamp"
        }
    ],
    createdHackathons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"PostHackathon"
        }
    ],
    deletedHackathons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"PostHackathons"
        }
    ],
    createdAnnouncements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Announcement"
        }
    ],
    approvedAnnouncements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcement"
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


const Admin= mongoose.model("Admin", adminSchema)
module.exports= Admin;