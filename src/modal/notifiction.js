import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    type: { type: String, enum: ["message", "friend_request"], required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
