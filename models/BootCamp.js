const mongoose= require("mongoose")
const BootCampSchema= mongoose.Schema({
    events: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Events"
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
        type: Bollean
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