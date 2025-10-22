import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./config/db.js";
import AuthRouter from "./routes/auth.route.js";
import BoardRoutes from "./routes/board.route.js";
import Cookies from "cookie-parser";
import http from "http";
import { Server as IOServer } from "socket.io";
import { console } from "inspector";
import userRouter from "./routes/user.route.js";

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
app.use("/api/user/", userRouter);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: process.env.PORT,
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join a board room
  socket.on("join-board", ({ boardId, token, name }) => {
    socket.join(boardId);
    console.log(`${name || socket.id} joined ${boardId}`);
    socket.to(boardId).emit("user-joined", { socketId: socket.id, name });
  });

  socket.on("draw", ({ boardId, path }) => {
    socket.to(boardId).emit("draw", { path });
  });

  socket.on("chat", ({ boardId, message, user }) => {
    socket.to(boardId).emit("chat", { message, user });
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

app.listen(port, () => {
  console.log("server started");
});
