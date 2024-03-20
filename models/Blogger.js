const mongoose= require("mongoose")
const BloggerSchema= mongoose.model({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    bloggerData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogger"
    },
    tutorData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor"
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
});

const Blogger= mongoose.model("Blogger", BloggerSchema);
module.exports= Blogger;
