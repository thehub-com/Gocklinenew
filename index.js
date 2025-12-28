import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === STATIC (HTML) ===
app.use(express.static(path.join(__dirname, "../public")));

// === SOCKET ===
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("newMessage", {
      text: data.text,
      time: data.time,
      user: data.user
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// === START ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 GockLine server running on", PORT);
});
