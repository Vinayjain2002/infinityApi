const mongoose= require("mongoose")

const calendarSchema= mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
       summary: {
        type: String
       },
       startDate: {
        type: String,
        required: true
       },
       endDate: {
        type: String,
        required: true
       },
       location: {
        type: String
       },
       description: {
        type: String
       },
       remainders: [
        {
            type: String
        }
       ],
       category: [
        {
            type: String
        }
       ]
});

const Calendar= mongoose.model("Calendar", calendarSchema);
module.exports= Calendar;