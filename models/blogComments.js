const mongoose= require("mongoose");
const blogCommentSchema=  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogs",
        required: true
    },
    text: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: [{
        type: Date,
        default: Date.now()
    }]
});
const BlogComment= mongoose.model("BlogComment",blogCommentSchema);
module.exports= BlogComment;