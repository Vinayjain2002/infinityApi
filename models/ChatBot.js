const mongoose= require("mongoose")

const ChatBotSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    convesationTopic: {
        type:String,
        required: true
    },
    lastMessage: [
        {
             message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const ChatBot= mongoose.model("ChatBot", ChatBotSchema);
module.exports= ChatBot;