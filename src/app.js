import express from "express";
import dotenv from "dotenv";
import database from "./dbconfig/index.js";
import cors from "cors";
import itemRoutes from "./controller/userController.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

dotenv.config();
database();

const app = express();

app.use(express.json());

app.use(cors("*"));

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
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    message: "API is running",
  });
});

app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
