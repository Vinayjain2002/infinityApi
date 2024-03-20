const mongoose= require("mongoose")
const TrainingSchema= mongoose.Schema({
    instructors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tutor"
        }
    ],
    description: {
        type:String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    tags: [
        {
            type:String
        }
    ],
    level: {
        type: String
    },
    prerequisite:[
        {
            type: String,
            default: "NO"
        }
    ],
    likes: {
        type: Number
    },
    displikes: {
        type:Number
    },
    studentReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    rating: {
        type: Number,
        default: 3
    },
    pricing: {
        type:Number
    },
    discount: {
        type: Number
    },
    offersTimePeriod: {
        type: Number
    },
    syllabus: [
        {
            type: String
        }
    ],
    duration: {
        type:String,
        required: true
    },
    dateOfPosted: {
        type: Date,
        default: Date.now()
    },
    videos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Videos"
        }
    ]
}, {timestamps: true});

const Training= mongoose.model("Training", TrainingSchema);
module.exports= Training;