import { Router } from "express";
import {
  getNotifications,
  markNotificationsRead,
} from "../controller/notificationController.js";

const router = Router();

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Get notifications for a user
 *     description: Retrieve all notifications for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to fetch notifications for
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: No notifications found
 */
router.get("/notifications/:userId", getNotifications);

/**
 * @swagger
 * /notifications/read:
 *   post:
 *     summary: Mark notifications as read
 *     description: Mark all notifications as read for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user marking notifications as read
 *     responses:
 *       200:
 *         description: Successfully marked notifications as read
 *       400:
 *         description: Invalid request data
 */
router.post("/notifications/read", markNotificationsRead);

export default router;
