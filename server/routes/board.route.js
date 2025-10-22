import express from "express";
import {
  CreateBoard,
  GetUserBoards,
  Loadboard,
  Saveboard, // Changed from saveCurrentBoard to Saveboard
} from "../controllers/board.controller.js";
import auth from "../middlewares/authMiddleware.js";

const BoardRoutes = express();

BoardRoutes.post("/", auth, CreateBoard);
BoardRoutes.get("/", auth, GetUserBoards);
BoardRoutes.get("/load/:id", auth, Loadboard);
BoardRoutes.put("/save/:id", auth, Saveboard); // Changed to Saveboard

export default BoardRoutes;
