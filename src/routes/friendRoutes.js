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

router.get("/my-friends", getFriends);
router.post("/friends/accept", acceptFriendRequest);
router.post("/requestSent", sendFriendRequest);
router.get("/allUser", getAllUsers);
router.get("/friend-requests/:userId", getFriendRequests);
router.post("/unfriend", unfriend);

export default router;
