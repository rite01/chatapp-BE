import { Router } from "express";
import {
  getChats,
  sendChatMessage,
  deleteChatMessage,
  markChatAsSeen,
} from "../controller/chatController.js";

const router = Router();

router.get("/chat/:userId", getChats);
router.post("/chat/send", sendChatMessage);
router.delete("/chat/:chatId", deleteChatMessage);
router.post("/chat/seen/:userId", markChatAsSeen);

export default router;
