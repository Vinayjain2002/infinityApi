const mongoose= require("mongoose")

const HackathonSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    organisedBy: {
        type: String,
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
        required: true
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
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    dateOfPosting: {
        type: Date,
        required: true
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
        {
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
        enum: ["online", "offline"]
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

        type: String
    }
  
},{timestamps: true});

const PostHackathon = mongoose.model("PostHackathon", postHackathonSchema);
module.exports= PostHackathon;
