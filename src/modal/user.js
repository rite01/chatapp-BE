import mongoose, { Schema } from 'mongoose';

const ItemSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], 
});

export default mongoose.model('Item', ItemSchema);
