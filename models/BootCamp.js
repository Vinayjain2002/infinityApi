const mongoose= require("mongoose")
const BootCampSchema= mongoose.Schema({
    potedBy: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        enum: ["User", "Blogger"],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["Online", "Offline"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    lastDateToApply: {
        type: Date,
        required: true
    },
    dateOfPosted: {
        type: Date,
        default: Date.now()
    },
    entryFee: {
        type: Number,
        default: "0"
    },
    totalSeats: {
        type: Number,
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    hasTags: [
        {type:String}
    ],
    queryContacts: [
        {
            type: String,
            required: true
        }
    ],
    organiser: [
        {
            type: String
        }
    ],
    eventsDetail: [
        {type: String}
    ],
    organisedUnder:[
        {type: String}
    ],
    registerationUrl: {
        type: String,
        required: true
    },
    hostedOn: {
        type: String
    },
    perks: [
        {
            type: String
        }
    ],
    certificationProvided: {
        type: Boolean
    },
    prerequisite: [
        {
            type: String
        }
    ],
    tutor: [
        {
            type: String,
            requried: true
        }
    ],
    duration: {
        type: Number
    },
    techStack: [
        {
            type: String
        }
    ],
    tutorId: {
        type: String
    }
});

const BootCamp= mongoose.model("BootCamp", BootCampSchema)
module.exports= BootCamp;