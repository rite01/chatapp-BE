import { Notification } from "../modal/notifiction.js";
import { FriendRequest } from "../modal/request.js";
import Item from "../modal/user.js";

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await Item.findById(userId).populate("friends");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: { _id: user._id, name: user.name, email: user.email },
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Sender and Receiver IDs are required" });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    await Notification.create({
      user: receiverId,
      type: "friend_request",
      sender: senderId,
      message: "You received a friend request.",
    });

    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
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
};

export const getAllUsers = async (req, res) => {
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
};

export const getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "_id name email profilePic");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unfriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res
        .status(400)
        .json({ message: "User ID and Friend ID are required" });
    }

    await Item.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await Item.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.json({ message: "Successfully unfriended" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfriend" });
  }
};
