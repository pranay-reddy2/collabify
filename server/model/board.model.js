// backend/model/board.model.js
import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // DO NOT put unique: true here - this caused your issue!
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      default: "",
    },
    data: {
      blocks: {
        type: Array,
        default: [],
      },
      drawing: {
        type: Array,
        default: [],
      },
    },
  },
  { timestamps: true }
);

// Optional: If you want to prevent duplicate board names per user
// Uncomment this line:
// boardSchema.index({ name: 1, owner: 1 }, { unique: true });

const Board = mongoose.model("Board", boardSchema);

export default Board;
