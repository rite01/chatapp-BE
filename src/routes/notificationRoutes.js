import { Router } from "express";
import {
  getNotifications,
  markNotificationsRead,
} from "../controller/notificationController.js";

const router = Router();

router.get("/notifications/:userId", getNotifications);
router.post("/notifications/read", markNotificationsRead);

export default router;
