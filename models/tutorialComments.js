const mongoose= require("mongoose");
const tutorialCommentSchema=  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutorial",
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
const TutorialComment= mongoose.model("TutorialComment",tutorialCommentSchema);
module.exports= TutorialComment;