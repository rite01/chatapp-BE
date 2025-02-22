import { Router } from "express";
import {
  acceptFriendRequest,
  getAllUsers,
  getFriendRequests,
  getFriends,
  sendFriendRequest,
  unfriend,
} from "../controller/friendController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Friends Route
 *   description: Friends API
 */

/**
 * @swagger
 * /my-friends:
 *   get:
 *     summary: Get all friends of the authenticated user
 *     description: Retrieve a list of all friends for the logged-in user.
 *     tags: [Friends Route]
 *     responses:
 *       200:
 *         description: Successfully retrieved friends list
 *       401:
 *         description: Unauthorized
 */
router.get("/my-friends", getFriends);

/**
 * @swagger
 * /friends/accept:
 *   post:
 *     summary: Accept a friend request
 *     description: Accept a pending friend request.
 *     tags: [Friends Route]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: The ID of the friend request
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Friend request not found
 */
router.post("/friends/accept", acceptFriendRequest);

/**
 * @swagger
 * /requestSent:
 *   post:
 *     summary: Send a friend request
 *     description: Send a new friend request to another user.
 *     tags: [Friends Route]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/requestSent", sendFriendRequest);

/**
 * @swagger
 * /allUser:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system.
 *     tags: [Friends Route]
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 *       401:
 *         description: Unauthorized
 */
router.get("/allUser", getAllUsers);

/**
 * @swagger
 * /friend-requests/{userId}:
 *   get:
 *     summary: Get friend requests for a user
 *     description: Retrieve all pending friend requests for a specific user.
 *     tags: [Friends Route]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get friend requests for
 *     responses:
 *       200:
 *         description: Successfully retrieved friend requests
 *       400:
 *         description: Invalid user ID
 */
router.get("/friend-requests/:userId", getFriendRequests);

/**
 * @swagger
 * /unfriend:
 *   post:
 *     summary: Unfriend a user
 *     description: Remove a user from the friend list.
 *     tags: [Friends Route]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to unfriend
 *     responses:
 *       200:
 *         description: Successfully unfriended the user
 *       404:
 *         description: User not found
 */
router.post("/unfriend", unfriend);

export default router;
