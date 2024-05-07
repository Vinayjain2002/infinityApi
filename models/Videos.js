const mongoose= require("monoose")

const VideosSchema= mongoose.Schame({
    url: {
        type: String
    },
    videoBlocked: {
        type: Bollean,
        default: false
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
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
    
    title: {
        type: String,
        required:true
    },
    summary:{
        type: String
    },
    description: [
        {
            type: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    }
});

const Video= mongoose.model("Video", VideosSchema);
module.exports= Video;