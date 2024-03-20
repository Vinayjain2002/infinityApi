const mongoose= require("mongoose");
const commentSchema=  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Creator",
        required: true
    },
    blogs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    text: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: [{
        type: Date,
        default: Date.now
    }]
});
const Comment= mongoose.model("Comment",commentSchema);
module.exports= Comment;