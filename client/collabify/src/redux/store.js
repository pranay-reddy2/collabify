import { configureStore } from "@reduxjs/toolkit";
// ensure these files default-export the reducer (name them reducer in each slice file)
import userReducer from "./userslice.js";
import boardReducer from "./boardSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
  },
});

export default store;
