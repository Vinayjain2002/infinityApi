const mongoose= require("mongoose");
const userCommentSchema=  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
const UserComment= mongoose.model("UserComment",userCommentSchema);
module.exports= UserComment;