import mongoose, { Schema } from 'mongoose';

const friendRequestSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
});

export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
