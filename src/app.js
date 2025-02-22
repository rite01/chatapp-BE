import express from "express";
import dotenv from "dotenv";
import database from "./dbconfig/index.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
app.use(cors({ origin: "*" }));

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

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      version: "1.0.0",
      description: "API documentation for Chat App",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
      {
        url: process.env.DEPLOYED_URL || "https://chatapp-be-1.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    socket.join(userId);
  });

  socket.on("sendFriendRequest", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("friendRequestReceived", { senderId });
  });

  socket.on("acceptFriendRequest", ({ senderId, receiverId }) => {
    io.to(senderId).emit("friendRequestAccepted", { receiverId });
  });

  socket.on("sendMessage", (message) => {
    io.to(message.receiverId).emit("newMessage", message);
  });

  socket.on("getMessage", (message) => {
    io.to(message.receiverId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  if (process.env.DEPLOYED_URL) {
    console.log(
      `Swagger docs available at ${process.env.DEPLOYED_URL}/api-docs`
    );
  }
});
