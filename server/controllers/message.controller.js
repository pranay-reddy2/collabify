// server/controllers/message.controller.js
import Message from "../model/message.model.js";
import Board from "../model/board.model.js";

export const getMessages = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user;

    // Check if user has access to this board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    const hasAccess =
      board.owner.toString() === userId.toString() ||
      board.collaborators.some(
        (collab) => collab.toString() === userId.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Fetch messages
    const messages = await Message.find({ boardId })
      .sort({ createdAt: 1 })
      .limit(100)
      .populate("sender", "name avatar");

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { content } = req.body;
    const userId = req.user;

    // Check if user has access to this board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    const hasAccess =
      board.owner.toString() === userId.toString() ||
      board.collaborators.some(
        (collab) => collab.toString() === userId.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Get sender info
    const User = (await import("../model/user.model.js")).default;
    const user = await User.findById(userId);

    const message = await Message.create({
      boardId,
      sender: userId,
      senderName: user.name,
      content,
      type: "text",
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name avatar"
    );

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ msg: err.message });
  }
};
