const mongoose= require("mongoose")
const FestSchema= mongoose.Schema(
    {
        potedBy: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            enum: ["User", "Blogger", "Tutor"],
            required: true
        },
        eventname: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            enum: ["Online", "Offline"],
            required: true
        },
        lastDateToApply: {
            type: Date,
            required: true
        },
        dateOfPosted: {
            type: Date,
            default: Date.now()
        },
        entryFee: {
            type: Number,
            default: "0"
        },
        totalSeats: {
            type: Number,
            // required: true
        },
        description: {
            type: String,
            required: true
        },
        hasTags: [
            {type:String}
        ],
        queryContacts: [
            {
                type: String,
                required: true
            }
        ],
        organiser: [
            {
                type: String
            }
        ],
        eventsDetail: [
            {type: String}
        ],
        organisedUnder:[
            {type: String}
        ],
        registerationUrl: {
            type: String,
            required: true
        },    
        events: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Events"
        },
        city: {
            type: String,
            required: true
        },
        venue: {
            type:String,
             required: true
        },
        chiefGuests: [
            {
                type: String,
            }
        ],
        dressCode: {
            type: String
        },
        perks: [
            {
                type: String
            }
        ]
    }
);

const Fest= mongoose.model("Fest",FestSchema);
module.exports= Fest;