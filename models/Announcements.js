const mongoose= require("mongoose")

const AnnouncementSchema= mongoose.Schema({
    approved: {
        type: Boolean,
        default: false
    },
    createdByTutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor"
    },
    createdByBlogger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogger"
    },
    createdByAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    urgent: {
        type: Boolean,
        default: false
    },
    targetAudience: [
        {
            type: String,
        }
    ],
    message: [
        {
            type: String,
            required: true
        }
    ],
    image: {
        type: String
    },
    description: [
        {
            type: String
        }
    ]
});

const Announcement= mongoose.model( "Announcement", AnnouncementSchema);
module.exports= Announcement