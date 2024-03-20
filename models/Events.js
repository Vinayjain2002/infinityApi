const mongoose=require("mongoose");
const EventSchema= mongoose.Schema({
    potedBy: {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        enum: ["User", "Blogger", "Tutor"],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["Online", "Offline"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ["Hackathon", "BootCamp", "Fest"],
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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hasTags: [
        {type:String}
    ],
    query: [
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
    registerationDetail: {
        type: String,
        required: true
    }

});

const Events= mongoose.Schema("Events",EventSchema);
module.exports= Events;