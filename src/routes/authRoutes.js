// import { Router } from "express";
// import multer from "multer";
// import { loginUser, registerUser } from "../controller/authController.js";

// const router = Router();
// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// router.post("/create", upload.single("profilePic"), registerUser);
// router.post("/login", loginUser);

// export default router;

import express from "express";
import multer from "multer";
import {
  loginUser,
  registerUser,
  updateUser,
} from "../controller/authController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * /api/auth/create:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/create", upload.single("profilePic"), registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/update:
 *   post:
 *     summary: Update user information
 *     description: Updates user details and optionally updates the profile picture.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid user data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.post("/update", upload.single("profilePic"), updateUser);

export default router;
