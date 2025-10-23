import express from "express";
import {
  CreateBoard,
  GetUserBoards,
  Loadboard,
  Saveboard,
  AddCollaborator,
  RemoveCollaborator,
} from "../controllers/board.controller.js";
import auth from "../middlewares/authMiddleware.js";

const BoardRoutes = express();

BoardRoutes.post("/", auth, CreateBoard);
BoardRoutes.get("/", auth, GetUserBoards);
BoardRoutes.get("/load/:id", auth, Loadboard);
BoardRoutes.put("/save/:id", auth, Saveboard);
BoardRoutes.post("/:id/collaborators", auth, AddCollaborator);
BoardRoutes.delete(
  "/:id/collaborators/:collaboratorId",
  auth,
  RemoveCollaborator
);

export default BoardRoutes;
