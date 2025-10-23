import express from "express";
import {
  getMessages,
  createMessage,
} from "../controllers/message.controller.js";
import auth from "../middlewares/authMiddleware.js";

const MessageRoutes = express.Router();

MessageRoutes.get("/:boardId", auth, getMessages);
MessageRoutes.post("/:boardId", auth, createMessage);

export default MessageRoutes;
