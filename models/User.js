const mongoose= require("mongoose")
const userSchema= new mongoose.Schema({
    blocked: {
        type: Boolean,
        default: false
    },
    authenticated: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String
    },
    speciality:[
        {
            type: String
        }
    ],
    emailChangeToken: {
        type: String
    },
    otp: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    socialMedia: [
        {
            type: String,
            default: "",
        }
    ],
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
   },
    bio: {
        type:String,
        trim: true,
        default: "Hello EveryBody"
    },
    description: {
        type: String,
        trim: true
    },
    profilePicture: {
        type:String,
    },
    coverPicture: {
        type:String,
        default: ""
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date
    },
    wanttoCollaborate: {
        type: Boolean,
        default: true
    },
    eventsApplied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Events"
        }
    ],
    eventsOrganised: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Events"
        }
    ],
    hackathonsWinned: [
        {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Hackathons"
        }
    ],
    rank: {
        type: Number,
    },
    eventsAttained: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Events"
        }
    ],
    blockedList:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    age: {
        type: Number
    },
    location: {
        type: String,
    },
    prefferedLocation: [
        {
            type: String,
        }
    ],
    prefferedEvents: [
        {
        type: String
    }
    ],
    coursesApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseStudents"
    },
    savedBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blogs"
        }
    ],
    savedHackathons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathons"
        }
    ],
    savedProjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    savedBootcamp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bootcamp"
        }
    ],
    savedFest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fest"
        }
    ],
    hackathonsApplied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathons"
        }
    ],
    festPosted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fest"
        }
    ],
    bootCampPosted: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Bootcamp"
        }
    ],
    hackathonsPosted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PostHackathon"
        }
    ],
    projectsUploaded: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    calendar: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Calendar"
        }
    ]
});

const User= mongoose.model("User", userSchema)
module.exports=User;