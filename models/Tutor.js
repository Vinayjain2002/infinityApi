const mongoose= require("mongoose")

const TutorSchema= mongoose.Schema({
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
    tutorName: {
        type: String,
        trim: true,
        lowercase: true
    },
    videos: [
        {
            type: String,  
        }
    ],
    videoCount: {
        type:Number,
    },
    popularVideos: [
        {
            type: String
        }
    ],
    students: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students"
    },
    teachedStudents: {
        type: Number,
    },
    doubtsResolved: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doubts"
    },
    subjectsTaught: [
        {
            type: String,
        }
    ],
    experience: {
        type: String,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses"
        }
    ],
    rating: [
        {
            type: Number,
            default: 3
        }
    ]

});

const Tutor= mongoose.model("Tutor",TutorSchema );
module.exports= Tutor;