import { Router } from "express";
import {
  getChats,
  sendChatMessage,
  deleteChatMessage,
  markChatAsSeen,
  editChatMessage,
} from "../controller/chatController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ChatRoutes
 *   description: Chat API
 */

/**
 * @swagger
 * /chat/{userId}:
 *   get:
 *     summary: Get chats for a specific user
 *     description: Retrieve all chat messages associated with a user.
 *     tags: [ChatRoutes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get chats for
 *     responses:
 *       200:
 *         description: Successfully retrieved chats
 *       400:
 *         description: Invalid user ID
 */
router.get("/chat/:userId", getChats);

/**
 * @swagger
 * /chats/{chatId}:
 *   put:
 *     summary: Edit a chat message
 *     description: Update the content of an existing chat message.
 *     tags: [ChatRoutes]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat message to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: New message content
 *     responses:
 *       200:
 *         description: Chat message successfully edited
 *       404:
 *         description: Chat message not found
 */
router.put("/chats/:chatId", editChatMessage);

/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Send a new chat message
 *     description: Create and send a new chat message.
 *     tags: [ChatRoutes]
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
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat message sent successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/chat/send", sendChatMessage);

/**
 * @swagger
 * /chat/{chatId}:
 *   delete:
 *     summary: Delete a chat message
 *     description: Remove a specific chat message.
 *     tags: [ChatRoutes]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat message to delete
 *     responses:
 *       200:
 *         description: Chat message deleted successfully
 *       404:
 *         description: Chat message not found
 */
router.delete("/chat/:chatId", deleteChatMessage);

/**
 * @swagger
 * /chat/seen/{userId}:
 *   post:
 *     summary: Mark chats as seen
 *     description: Mark all messages from a user as seen.
 *     tags: [ChatRoutes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose chats are being marked as seen
 *     responses:
 *       200:
 *         description: Chats marked as seen
 *       400:
 *         description: Invalid request
 */
router.post("/chat/seen/:userId", markChatAsSeen);

export default router;
