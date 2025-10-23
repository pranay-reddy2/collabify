import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
  },
  { timestamps: true }
);

messageSchema.index({ boardId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
