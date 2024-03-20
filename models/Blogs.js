const mongoose= require("mongoose")
const blogSchema= new mongoose.Schema({
    blogTopic: {
        type: String,
        required: true
    },
    blogContent: {
        type: String,
        required: true
    },
    blogImages: [
        {
            type: String,
            default: ""
        }
    ],
    level: {
        type: String,
        default: "Medium"
    },
    tags: {
        type: [String],
        dfault: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Creator"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

const Blog= new mongoose.model("Blog", blogSchema);
module.exports= Blog;