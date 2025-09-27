const express = require("express");
const http = require("http"); // ⬅️ new
const { Server } = require("socket.io"); // ⬅️ new
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // ⬅️ wrap app
const io = new Server(server, {
  cors: {
    origin: "*", // or specific React URL in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const Message = require("./models/Message");
const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const activeUsers = new Set();
// --- Socket.IO logic ---
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("login", (nickname, callback) => {
    if (activeUsers.has(nickname)) {
      callback({ success: false, error: "Name already taken" });
    } else {
      socket.nickname = nickname;
      activeUsers.add(nickname);
      callback({ success: true });
      io.emit("userList", Array.from(activeUsers)); // optional broadcast
      console.log(`User logged in: ${nickname}`);
    }
  });

  // join private room between two users (sorted name to keep unique room id)
  socket.on("joinRoom", ({ me, other }) => {
    const roomId = [me, other].sort().join("_");
    socket.join(roomId);
    socket.currentRoom = roomId;
    console.log(`${me} joined room ${roomId}`);
  });

  socket.on("privateMessage", async ({ to, message }) => {
    if (!socket.username || !socket.currentRoom) return;
    const roomId = [socket.username, to].sort().join("_");
    const newMsg = new Message({
      room: roomId,
      username: socket.username,
      message,
    });
    await newMsg.save();
    io.to(roomId).emit("privateMessage", newMsg);
  });

  // Receive a chat message
  socket.on("chatMessage", async (data) => {
    if (!socket.nickname) return;
    // Save to Mongo
    const newMessage = new Message({
      username: socket.nickname,
      message: data.message,
    });
    await newMessage.save();

    // Broadcast to everyone
    io.emit("chatMessage", newMessage);
  });

  socket.on("disconnect", () => {
    if (socket.nickname) {
      activeUsers.delete(socket.nickname);
      io.emit("userList", Array.from(activeUsers));
      console.log(`User disconnected: ${socket.nickname}`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
