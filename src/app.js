import express from "express";
import dotenv from "dotenv";
import database from "./dbconfig/index.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
database();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow all origins (change this in production)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET || "23564564536345dsfgsdf";
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", ({ userId }) => {
    socket.join(userId); // Join room for the user
  });

  socket.on("sendMessage", (message) => {
    io.to(message.receiverId).emit("newMessage", message); // Send message to receiver
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// // ====== SOCKET.IO INTEGRATION ======
// const users = new Map(); // To store connected users

// io.on("connection", (socket) => {
//   socket.on("join", (userId) => {
//     users.set(userId, socket.id);
//     console.log(`User ${userId} connected with socket ID: ${socket.id}`);
//   });

//   socket.on("sendMessage", ({ senderId, receiverId, message }) => {
//     console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
//     if (users.has(receiverId)) {
//       io.to(users.get(receiverId)).emit("receiveMessage", {
//         senderId,
//         message,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     users.forEach((value, key) => {
//       if (value === socket.id) {
//         users.delete(key);
//         console.log(`User ${key} disconnected`);
//       }
//     });
//   });
// });

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
