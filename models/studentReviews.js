const mongoose= require("mongoose")

const studentReviews= mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Student= mongoose.Model("Student", studentSchema);
module.exports= Student;