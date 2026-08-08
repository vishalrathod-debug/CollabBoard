require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// 🔥 SOCKET HANDLER (IMPORTANT)
const socketHandler = require("./sockets");

const app = express();
const server = http.createServer(app);

// ==============================
// 🔥 SOCKET.IO INIT
// ==============================
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ restrict in production
  },
});

// 🔥 Attach socket logic
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

// ==============================
// 🔹 MIDDLEWARES
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// 🔹 ROUTES
// ==============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/boards", require("./routes/boardRoutes"));

// ==============================
// 🔹 HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ==============================
// 🔹 GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==============================
// 🔥 START SERVER
// ==============================
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed:", error.message);
    process.exit(1);
  }
};

startServer();