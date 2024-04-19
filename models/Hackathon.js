const mongoose= require("mongoose")

const HackathonSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    organisedBy: {
        type: String,
        require: true
    },
    AppliedBy: {
        type: Number,
        default: "200"
    },
    likedBy: {
        type: Number,
    },
    location: {
        type: String,
    },
    level: {
        type: String,
        required: true
    },
    prizes: {
        type: String,
        required: true,
    },
    entryFee: {
        type: Number,
        default: 0
    },
    venue: {
        type: String,
    },

    dateOfPosting: {
        type: Date,
        required: true,
        default: Date.now()
    },
    ideaSubmissionDate: {
        type: Date,
        required: true
    },
    problemStatement: [
        {
            type: String,
            required: true
        }
    ],
    pictures: [
        {
            type: String,
            default: ""
        }
    ],
    minTeamMembers: {
        type: Number,
        default: 1
    },
    additionalBenefits: [
        {max
            type: String
        }
    ],
    maxTeamMembers: {
        typr:Number,
        default: 3,
        required: true
    },
    organisationType: {
        type:String,
        enum: ["Private", "Govertment", "NGO"]
    },
    mode: {
        type: String,
        required: true,
        enum: ["online", "offline"]
    },
    lastDateToApply: {
        type:Date,
        required: true
    },
    techStackRequired: {
        type: [String]        
    },
    conditions: [
        {
            type: String
        }
    ],
    description: {
        required: true,
        type: String
    },
    registerationUrl: {
        type: String,
        required: true
    }
  
},{timestamps: true});

const PostHackathon = mongoose.model("PostHackathon",HackathonSchema);
module.exports= PostHackathon;
