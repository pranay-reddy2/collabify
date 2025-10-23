// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./config/db.js";
import AuthRouter from "./routes/auth.route.js";
import BoardRoutes from "./routes/board.route.js";
import MessageRoutes from "./routes/message.route.js";
import Cookies from "cookie-parser";
import http from "http";
import { Server as IOServer } from "socket.io";
import userRouter from "./routes/user.route.js";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const port = 8000;
ConnectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(Cookies());
app.use(express.json());
app.use("/api/auth/", AuthRouter);
app.use("/api/boards/", BoardRoutes);
app.use("/api/messages/", MessageRoutes);
app.use("/api/user/", userRouter);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id, "User:", socket.userId);

  // Join a board room
  socket.on("join-board", ({ boardId, userName }) => {
    socket.join(boardId);
    console.log(`${userName || socket.id} joined board ${boardId}`);
    socket.to(boardId).emit("user-joined", {
      socketId: socket.id,
      userName,
      userId: socket.userId,
    });
  });

  // Handle drawing updates
  socket.on("draw", ({ boardId, path }) => {
    socket.to(boardId).emit("draw", { path });
  });

  // Handle block updates
  socket.on("block-update", ({ boardId, block, action }) => {
    socket.to(boardId).emit("block-update", { block, action });
  });

  // Handle new messages
  socket.on("send-message", ({ boardId, message }) => {
    socket.to(boardId).emit("new-message", message);
  });

  // Handle typing indicator
  socket.on("typing", ({ boardId, userName }) => {
    socket.to(boardId).emit("user-typing", { userName });
  });

  socket.on("stop-typing", ({ boardId }) => {
    socket.to(boardId).emit("user-stop-typing");
  });

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user-left", { socketId: socket.id });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
