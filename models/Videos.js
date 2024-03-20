const mongoose= require("monoose")

const VideosSchema= mongoose.Schame({
    freeAviable: {
        type: Boolean,
        default: false
    },
    url: {
        type: String
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Tutor"
    },
    ownerPlaced: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    length: {
        type: Number
    },
    tags: [
        {
            type: String
        }
    ],
    level: {
        type: String,
        default: "Medium"
    },
    prerequisite: [
        {
            type: String,
        }
    ],
    techStack: [
        {
            type: String
        }
    ],
    description: [
        {
            type: String
        }
    ]
});

const Video= mongoose.model("Video", VideosSchema);
module.exports= Video;