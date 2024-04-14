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
        default: "Medium",
        required: true
    },
    tags: {
        type: [String],
        dfault: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogger"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

const Blog= new mongoose.model("Blog", blogSchema);
module.exports= Blog;

// we are going to create a blog for the user
