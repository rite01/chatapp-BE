import { Chat } from "../modal/chat.js";
import { Notification } from "../modal/notifiction.js";

export const getChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { friendId } = req.query;

    if (!friendId)
      return res.status(400).json({ message: "Friend ID is required" });

    const chats = await Chat.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).populate("sender receiver");

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendChatMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const chatMessage = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await Notification.create({
      user: receiverId,
      type: "message",
      sender: senderId,
      message: "You received a new message.",
    });

    res.json(chatMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const deleteChatMessage = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat message not found" });
    }

    await Chat.findByIdAndDelete(chatId);

    res.json({ message: "Chat message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete chat message" });
  }
};

export const markChatAsSeen = async (req, res) => {
  try {
    const { userId } = req.params;
    const { friendId } = req.body;

    if (!friendId)
      return res.status(400).json({ message: "Friend ID is required" });

    const updatedChats = await Chat.updateMany(
      {
        sender: friendId,
        receiver: userId,
        seen: false,
      },
      { seen: true }
    );

    res.json({ message: "Messages marked as seen", updatedChats });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark messages as seen" });
  }
};
