const mongoose= require("mongoose")

const ProjectSchema= mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectUploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    projectUploadedOn: {
        type: Date,
        default: Date.now()
    },
    tags:[
        {
            type:String
        }
    ],
    projectLevel: {
        type: String,
        default: "Medium"
    },
    gitRepo: {
        type: String,
        required: true
    },
    privateProject: {
        type:String,
        required: true,
        default: false
    },
    description: [
        {
            type: String,
            required:true
        }
    ],
    projectImage: {
        type: String,
        required: true
    },
    techStack: [
        {
            type: String,
            required: true
        }
    ],
    noOfPages: {
        type: Number,
        required: true
    },
    teamMemebers: [{
        type: String,
    }],
    projectOverView: {
        type: String,
        required: true
    },
    projectAcheivements: [
        {
            type: String
        }
    ],
    prerequisite: [{
        type: String
    }],
    adminUploaded: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

const Project=mongoose.model("Project", ProjectSchema);
module.exports= Project;