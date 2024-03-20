const mongoose= require("mongoose")
const enrolledStudentschema= mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        REF: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training"
    },
    applyingDate: {
        type: Date,
        default: Date.now
    },
    Deadline: {
        type: Date,
    },
    price: {
        type: Number,
    },
    completedCourse: {
        type: Number,
    }
})

const enrolledStudent= mongoose.model("enrolledStudent", enrolledStudentschema);
module.exports= enrolledStudent;