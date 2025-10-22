// backend/model/board.model.js
// Make sure your schema matches this structure

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

const Board = mongoose.model("Board", boardSchema);

export default Board;
