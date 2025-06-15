import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { connectDB } from "./config/db";
import { setupSocket } from "./socket/socketHandler";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

setupSocket(io);
connectDB();

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
