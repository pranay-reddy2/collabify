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
const port = process.env.PORT || 8000;

ConnectDB();

// ✅ FIXED CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173",
  "https://collabify-czb7rwatl-pranay-reddy2s-projects.vercel.app", // Your current Vercel URL
  process.env.FRONTEND_URL,
];

// Remove any undefined/null values
const filteredOrigins = allowedOrigins.filter(Boolean);

console.log("🌐 Allowed CORS Origins:", filteredOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check exact match
      if (filteredOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (origin && origin.includes("vercel.app")) {
        return callback(null, true);
      }

      console.log("❌ Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// ✅ Handle preflight requests
app.options(/.*/, cors());

app.use(Cookies());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    allowedOrigins: filteredOrigins,
  });
});

app.use("/api/auth/", AuthRouter);
app.use("/api/boards/", BoardRoutes);
app.use("/api/messages/", MessageRoutes);
app.use("/api/user/", userRouter);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: filteredOrigins,
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

  socket.on("join-board", ({ boardId, userName }) => {
    socket.join(boardId);
    console.log(`${userName || socket.id} joined board ${boardId}`);
    socket.to(boardId).emit("user-joined", {
      socketId: socket.id,
      userName,
      userId: socket.userId,
    });
  });

  socket.on("draw", ({ boardId, path }) => {
    socket.to(boardId).emit("draw", { path });
  });

  socket.on("block-update", ({ boardId, block, action }) => {
    socket.to(boardId).emit("block-update", { block, action });
  });

  socket.on("send-message", ({ boardId, message }) => {
    socket.to(boardId).emit("new-message", message);
  });

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

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

httpServer.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log("🌐 CORS enabled for:", filteredOrigins);
});
