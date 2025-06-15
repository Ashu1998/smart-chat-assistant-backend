import { Server } from "socket.io";
import { handleUserMessage } from "../services/handleMessage.service";
import { Chat } from "../models/Chat";
import mongoose from "mongoose";

interface TokenPayload {
  userId: string;
}

interface ChatData {
  message: string;
  tokenPayload: TokenPayload;
}

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("chat", async (rawData) => {
      let data: ChatData;
    
      try {
        // Handle case when data is a JSON string
        data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      } catch (err) {
        console.error("❌ Invalid JSON received:", rawData);
        return socket.emit("chatReply", { reply: "Invalid data format" });
      }
    
      const { message, tokenPayload } = data;
    
      if (!tokenPayload?.userId) {
        return socket.emit("chatReply", { reply: "Unauthorized: Missing user session" });
      }

      // Validate if userId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(tokenPayload.userId)) {
        console.error("❌ Invalid user ID format:", tokenPayload.userId);
        return socket.emit("chatReply", { reply: "Invalid user session" });
      }
    
      try {
        console.log("Message:", message);
        const reply = await handleUserMessage(message, tokenPayload.userId);

        console.log("Reply:", reply);
        
        // Create chat with validated ObjectId
        await Chat.create({
          userId: new mongoose.Types.ObjectId(tokenPayload.userId),
          message,
          reply
        });
    
        socket.emit("chatReply", { reply });
      } catch (error) {
        console.error("❌ Error handling chat message:", error);
        socket.emit("chatReply", { reply: "Something went wrong. Try again later!" });
      }
    });
  });
}
