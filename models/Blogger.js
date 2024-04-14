const mongoose= require("mongoose")
const bloggerSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    blocked:{
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
    emailChangeToken: {
        type: String
    },
    otp: {
        type: String,
    },
    name: {
        type: String,
        trim: true
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date
    },
    
    experience: [
        {
            type: String,
        }
    ],
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blogs"
        }
    ],
    mostLikedBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blogs"
        }
    ],
    blogsWritten: {
        type: Number
    },
    creationDate: {
        default: Date.now,
        type: Date
    },
    techStack: [
        {
            type: String,
        }
    ],
    blogsLevel: {
        type: String,
        default: "Normal"
    },
    blogsTopics: [
        {
            type: [String],
            default: [],   
        }
    ],
    festsPosted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fest"
        }
    ],
    hackathonsPosted: [
        {
            type: String
        }
    ],
    bootCampPosted: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "BootCamp"
        }
    ]
});

const Blogger= mongoose.model("Bogger", bloggerSchema)
module.exports=Blogger;
