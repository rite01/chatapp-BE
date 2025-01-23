import { Router } from "express";
import Item from "../modal/user.js";
import bcrypt from "bcrypt";
import { FriendRequest } from "../modal/request.js";
import { Chat } from "../modal/chat.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../app.js";

const router = Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/create", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Item.findOne({ email });
    console.log("existingUser", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
      });
      profilePicUrl = result.secure_url;
    }

    const user = await Item.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePicUrl,
    });

    const token = generateToken(user._id);

    res.status(201).json({ message: "User created successfully", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Item.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = generateToken(user._id);

    const userDetails = user.toObject();
    delete userDetails.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-friends", async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await Item.findById(userId).populate({
      path: "friends",
      model: "Item",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      friends: user.friends,
    });
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/friends/accept", async (req, res) => {
  const { requestId } = req.body;

  const request = await FriendRequest.findById(requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "accepted";
  await request.save();

  await Item.findByIdAndUpdate(request.sender, {
    $addToSet: { friends: request.receiver },
  });
  await Item.findByIdAndUpdate(request.receiver, {
    $addToSet: { friends: request.sender },
  });

  res.json({ message: "Friend request accepted" });
});

router.post("/requestSent", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(200).json({ message: "Request already sent." });
      }
      if (existingRequest.status === "accepted") {
        return res.status(200).json({ message: "You are already friends." });
      }
    }

    const newRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!newRequest) {
      return res
        .status(500)
        .json({ message: "Failed to send the friend request." });
    }

    res.status(201).json({
      message: "Friend request sent successfully.",
      request: newRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/allUser", async (req, res) => {
  try {
    const { userId } = req.query;

    const friendRequests = await FriendRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .select("sender receiver")
      .exec();

    const involvedUserIds = new Set();

    friendRequests.forEach((request) => {
      if (request.sender) involvedUserIds.add(request.sender.toString());
      if (request.receiver) involvedUserIds.add(request.receiver.toString());
    });

    const users = await Item.find({
      _id: { $ne: userId, $nin: Array.from(involvedUserIds) },
    });

    res.json(users);
  } catch (err) {
    console.error("Error in /allUser:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/friend-requests/:userId", async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  try {
    const query = { receiver: userId };
    if (status) {
      query.status = status;
    }

    const friendRequests = await FriendRequest.find(query)
      .populate("sender", "name email profilePic")
      .populate("receiver", "name email profilePic")
      .exec();

    res.status(200).json({ success: true, data: friendRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/chat/:userId", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.query;

  try {
    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    const chats = await Chat.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).populate("sender receiver");

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/chat/send", async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  const chatMessage = await Chat.create({
    sender: senderId,
    receiver: receiverId,
    message,
  });
  res.json(chatMessage);
});

export default router;
