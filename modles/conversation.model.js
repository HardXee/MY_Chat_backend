
import mongoose from "mongoose";


const ConversationSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      text: String,

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      type: {
        type: String,
        default: "text",
      },

      createdAt: Date,
    },
  },

  {
    timestamps: true,
  },
);

const Convo = mongoose.model("Convo",  ConversationSchema);

export default Convo






