const mongoose= require("mongoose")
const FestSchema= mongoose.Schema(
    {
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