import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  reply: String,
  timestamp: { type: Date, default: Date.now }
});

export const Chat = mongoose.model("Chat", chatSchema);
