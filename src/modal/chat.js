import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    message: String,
    timestamp: { type: Date, default: Date.now },
  });
  
 export const Chat = mongoose.model('Chat', chatSchema);