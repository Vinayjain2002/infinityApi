const mongoose= require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }],
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Can also reference a 'ChatBot' model if needed
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
      ]
    }],
    isChatBotConversation: { // Flag to identify chatbot conversations
      type: Boolean,
      default: false
    }
  });


  const Conversation= mongoose.model("Conversation", conversationSchema);
  module.exports=Conversation;