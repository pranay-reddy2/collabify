// src/redux/boardSlice.js - Update your Redux slice to match backend structure

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBoard, updateBoard } from "../api/api";

// Fetch board by ID
export const fetchBoardById = createAsyncThunk(
  "board/fetchById",
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await getBoard(boardId);
      console.log("Fetched board data from API:", response);
      return response;
    } catch (error) {
      console.error("Fetch board error:", error);
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch board"
      );
    }
  }
);

// Save current board
export const saveCurrentBoard = createAsyncThunk(
  "board/saveCurrent",
  async ({ boardId, blocks, drawing }, { rejectWithValue }) => {
    try {
      // Match backend structure: data: { blocks, drawing }
      const updateData = {
        data: {
          blocks,
          drawing,
        },
      };
      console.log("Saving board with data:", updateData);
      const response = await updateBoard(boardId, updateData);
      console.log("Save response:", response);
      return response;
    } catch (error) {
      console.error("Save board error:", error);
      return rejectWithValue(
        error.response?.data?.msg || "Failed to save board"
      );
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    currentBoardId: null,
    boardName: "",
    content: [], // blocks
    drawing: [],
    status: "idle",
    error: null,
    isSaving: false,
    drawMode: false,
    strokeColor: "#E5E7EB",
    isErasing: false,
  },
  reducers: {
    setCurrentBoardId: (state, action) => {
      state.currentBoardId = action.payload;
    },
    addBlock: (state, action) => {
      const newBlock = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.content.push(newBlock);
    },
    updateBlockValue: (state, action) => {
      const { id, value } = action.payload;
      const block = state.content.find((b) => b.id === id);
      if (block) block.value = value;
    },
    deleteBlock: (state, action) => {
      state.content = state.content.filter((b) => b.id !== action.payload);
    },
    updateBlockPosition: (state, action) => {
      const { id, x, y } = action.payload;
      const block = state.content.find((b) => b.id === id);
      if (block) {
        block.x = x;
        block.y = y;
      }
    },
    updateBlockSize: (state, action) => {
      const { id, width, height } = action.payload;
      const block = state.content.find((b) => b.id === id);
      if (block) {
        block.width = width;
        block.height = height;
      }
    },
    setDrawMode: (state, action) => {
      state.drawMode = action.payload;
    },
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload;
      state.isErasing = false;
    },
    setEraserMode: (state, action) => {
      state.isErasing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Board
      .addCase(fetchBoardById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("Fetching board...");
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        console.log("Fetch fulfilled with payload:", action.payload);
        state.status = "succeeded";
        state.boardName = action.payload.name || "";

        // Handle backend structure: data.blocks and data.drawing
        state.content = action.payload.data?.blocks || [];
        state.drawing = action.payload.data?.drawing || [];

        console.log("Board loaded - Name:", state.boardName);
        console.log("Board loaded - Blocks:", state.content.length);
        console.log("Board loaded - Drawing paths:", state.drawing.length);
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        console.error("Fetch rejected:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      })
      // Save Board
      .addCase(saveCurrentBoard.pending, (state) => {
        state.isSaving = true;
        console.log("Saving board...");
      })
      .addCase(saveCurrentBoard.fulfilled, (state, action) => {
        console.log("Save fulfilled with payload:", action.payload);
        state.isSaving = false;

        // Update state with saved data if backend returns it
        if (action.payload.board?.data?.blocks) {
          state.content = action.payload.board.data.blocks;
        }
        if (action.payload.board?.data?.drawing) {
          state.drawing = action.payload.board.data.drawing;
        }

        console.log("Board saved successfully");
      })
      .addCase(saveCurrentBoard.rejected, (state, action) => {
        console.error("Save rejected:", action.payload);
        state.isSaving = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentBoardId,
  addBlock,
  updateBlockValue,
  deleteBlock,
  updateBlockPosition,
  updateBlockSize,
  setDrawMode,
  setStrokeColor,
  setEraserMode,
} = boardSlice.actions;

export default boardSlice.reducer;
