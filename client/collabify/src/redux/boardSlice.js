// src/redux/boardSlice.js - Add fetchUserBoards action

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBoard, updateBoard, getUserBoards } from "../api/api";

// Fetch all user boards
export const fetchUserBoards = createAsyncThunk(
  "board/fetchUserBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserBoards();
      console.log("Fetched user boards:", response);
      return response;
    } catch (error) {
      console.error("Fetch user boards error:", error);
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch boards"
      );
    }
  }
);

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
    content: [],
    drawing: [],
    userBoards: [], // Add this for dashboard
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
      // Fetch User Boards
      .addCase(fetchUserBoards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userBoards = action.payload;
        console.log("User boards loaded:", state.userBoards.length);
      })
      .addCase(fetchUserBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Board by ID
      .addCase(fetchBoardById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boardName = action.payload.name || "";
        state.content = action.payload.data?.blocks || [];
        state.drawing = action.payload.data?.drawing || [];
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Save Board
      .addCase(saveCurrentBoard.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveCurrentBoard.fulfilled, (state, action) => {
        state.isSaving = false;
        if (action.payload.board?.data?.blocks) {
          state.content = action.payload.board.data.blocks;
        }
        if (action.payload.board?.data?.drawing) {
          state.drawing = action.payload.board.data.drawing;
        }
      })
      .addCase(saveCurrentBoard.rejected, (state, action) => {
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
