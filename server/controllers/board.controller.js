// server/controllers/board.controller.js
import Board from "../model/board.model.js";
import User from "../model/user.model.js";

export const CreateBoard = async (req, res) => {
  const { name, owner, collaborators = [], description = "", data } = req.body;

  console.log("Received board data:", {
    name,
    owner,
    collaborators,
    description,
    data,
  });

  try {
    // Convert collaborator emails/names to user IDs
    const collaboratorIds = [];
    for (const identifier of collaborators) {
      const user = await User.findOne({
        $or: [{ email: identifier }, { name: identifier }],
      });
      if (user) {
        collaboratorIds.push(user._id);
      }
    }

    const board = await Board.create({
      name,
      owner,
      collaborators: collaboratorIds,
      description,
      data: {
        blocks: data?.blocks || [],
        drawing: data?.drawing || [],
      },
    });

    console.log("Created board:", board);

    res.status(201).json(board);
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(400).json({ msg: err.message });
  }
};

export const GetUserBoards = async (req, res) => {
  try {
    console.log("Fetching boards for user:", req.user);

    // Get boards where user is owner OR collaborator
    const boards = await Board.find({
      $or: [{ owner: req.user }, { collaborators: req.user }],
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    console.log("Found boards:", boards.length);
    res.status(200).json(boards);
  } catch (err) {
    console.error("Error fetching boards:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const Saveboard = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== SAVE BOARD DEBUG ===");
    console.log("Board ID:", id);
    console.log("User ID:", req.user);

    if (!req.body.data) {
      console.error("ERROR: No 'data' field in request body");
      return res.status(400).json({
        msg: "Invalid request format. Expected { data: { blocks, drawing } }",
      });
    }

    const { data } = req.body;
    const board = await Board.findById(id);

    if (!board) {
      console.error("Board not found:", id);
      return res.status(404).json({ msg: "Board not found" });
    }

    const ownerStr = board.owner.toString();
    const userStr = req.user.toString();

    // Check if user is owner OR collaborator
    const isOwner = ownerStr === userStr;
    const isCollaborator = board.collaborators.some(
      (collab) => collab.toString() === userStr
    );

    if (!isOwner && !isCollaborator) {
      console.error("Not authorized - user:", userStr);
      return res.status(403).json({ msg: "Not authorized" });
    }

    console.log("Authorization passed");

    // Update the data field
    board.data = {
      blocks: data?.blocks || [],
      drawing: data?.drawing || [],
    };

    await board.save();

    console.log("Board saved successfully!");

    res.json({ success: true, board });
  } catch (err) {
    console.error("=== SAVE BOARD ERROR ===");
    console.error("Error message:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

export const Loadboard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    console.log("Loading board:", id, "for user:", userId);

    const board = await Board.findById(id)
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    // Check if user has access (owner or collaborator)
    const hasAccess =
      board.owner._id.toString() === userId.toString() ||
      board.collaborators.some(
        (collab) => collab._id.toString() === userId.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ msg: "Access denied" });
    }

    console.log("Board loaded:", board.name);

    res.json(board);
  } catch (err) {
    console.error("Error loading board:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const AddCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { identifier } = req.body; // email or username
    const userId = req.user;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    // Only owner can add collaborators
    if (board.owner.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Only owner can add collaborators" });
    }

    // Find user by email or name
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if already a collaborator
    if (board.collaborators.includes(user._id)) {
      return res.status(400).json({ msg: "User is already a collaborator" });
    }

    board.collaborators.push(user._id);
    await board.save();

    const updatedBoard = await Board.findById(id)
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    res.json(updatedBoard);
  } catch (err) {
    console.error("Error adding collaborator:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const RemoveCollaborator = async (req, res) => {
  try {
    const { id, collaboratorId } = req.params;
    const userId = req.user;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    // Only owner can remove collaborators
    if (board.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ msg: "Only owner can remove collaborators" });
    }

    board.collaborators = board.collaborators.filter(
      (collab) => collab.toString() !== collaboratorId
    );

    await board.save();

    const updatedBoard = await Board.findById(id)
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    res.json(updatedBoard);
  } catch (err) {
    console.error("Error removing collaborator:", err);
    res.status(500).json({ msg: err.message });
  }
};
