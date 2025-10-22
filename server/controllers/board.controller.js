// backend/controllers/board.controller.js

import Board from "../model/board.model.js";

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
    const board = await Board.create({
      name,
      owner,
      collaborators,
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
    const boards = await Board.find({ owner: req.user });
    console.log("Found boards:", boards.length);
    res.status(200).json(boards); // Use json() instead of send()
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
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("User ID:", req.user);

    // Check if data exists in request body
    if (!req.body.data) {
      console.error("ERROR: No 'data' field in request body");
      console.log("Available fields:", Object.keys(req.body));
      return res.status(400).json({
        msg: "Invalid request format. Expected { data: { blocks, drawing } }",
        receivedKeys: Object.keys(req.body),
      });
    }

    const { data } = req.body;
    console.log("Data blocks count:", data?.blocks?.length || 0);
    console.log("Data drawing paths count:", data?.drawing?.length || 0);

    const board = await Board.findById(id);

    if (!board) {
      console.error("Board not found:", id);
      return res.status(404).json({ msg: "Board not found" });
    }

    console.log("Board found:", board.name);
    console.log("Board owner:", board.owner);

    // Convert owner to string for comparison if it's an ObjectId
    const ownerStr = board.owner.toString
      ? board.owner.toString()
      : board.owner;
    const userStr = req.user.toString ? req.user.toString() : req.user;

    console.log("Owner (string):", ownerStr);
    console.log("User (string):", userStr);
    console.log("Are they equal?", ownerStr === userStr);

    // Check authorization
    if (ownerStr !== userStr && !board.collaborators.includes(userStr)) {
      console.error("Not authorized - owner:", ownerStr, "user:", userStr);
      return res.status(403).json({ msg: "Not authorized" });
    }

    console.log("Authorization passed");

    // Update the data field
    board.data = {
      blocks: data?.blocks || [],
      drawing: data?.drawing || [],
    };

    console.log("Saving board with data:", {
      blocks: board.data.blocks.length,
      drawing: board.data.drawing.length,
    });

    await board.save();

    console.log("Board saved successfully!");

    res.json({ success: true, board });
  } catch (err) {
    console.error("=== SAVE BOARD ERROR ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    // Send detailed error in development
    res.status(500).json({
      msg: err.message,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export const Loadboard = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Loading board:", id);

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    console.log("Board loaded:", board);

    // Return the full board object
    res.json(board);
  } catch (err) {
    console.error("Error loading board:", err);
    res.status(500).json({ msg: err.message });
  }
};
