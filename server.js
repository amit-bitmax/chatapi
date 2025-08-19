const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;
    socket.join(userId);
    socket.userId = userId;
    console.log(`✔️ ${userId} joined room`);
  });

  socket.on("call:user", ({ callerId, receiverId, offer }) => {
    console.log(`📞 ${callerId} -> ${receiverId} (offer)`);
    io.to(receiverId).emit("incoming:call", { callerId, offer });
  });

  socket.on("call:answer", ({ callerId, answer }) => {
    console.log(`✅ answer from callee to ${callerId}`);
    io.to(callerId).emit("call:answered", { answer });
  });

  socket.on("ice:candidate", ({ receiverId, candidate }) => {
    if (!receiverId) return;
    io.to(receiverId).emit("ice:candidate", { candidate, from: socket.userId || socket.id });
    console.log(`📞 ice candidate from ${socket.userId || socket.id} -> ${receiverId}`);
  });

  socket.on("call:hangup", ({ peerId }) => {
    io.to(peerId).emit("call:ended");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id, "userId:", socket.userId);
  });
});

app.get("/", (req, res) => {
  res.send("server is alive!");
}); 
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => console.log(`🚀 Signaling server running on http://localhost:${PORT}`));
