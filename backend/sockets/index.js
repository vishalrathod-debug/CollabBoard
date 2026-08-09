const jwt = require("jsonwebtoken");
const Y = require("yjs");

const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const { getYDoc } = require("./yjsStore");
const { handleYjsUpdate } = require("./handlers/yjsHandler");
const { addUser, removeUser, getUsers } = require("./presence");

// ==============================
// 🔥 RATE LIMIT
// ==============================
const rateLimitMap = {};
const MAX_EVENTS_PER_SEC = 40;

function isRateLimited(socketId) {
  const now = Date.now();

  if (!rateLimitMap[socketId]) {
    rateLimitMap[socketId] = { count: 1, lastReset: now };
    return false;
  }

  const data = rateLimitMap[socketId];

  if (now - data.lastReset > 1000) {
    data.count = 1;
    data.lastReset = now;
    return false;
  }

  data.count++;
  return data.count > MAX_EVENTS_PER_SEC;
}

// ==============================
// 🔐 AUTH
// ==============================
function authenticateSocket(socket) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// ==============================
// 🚀 MAIN SOCKET HANDLER
// ==============================
module.exports = (socket, io) => {
  console.log("⚡ Connected:", socket.id);

  const userId = authenticateSocket(socket);

  if (!userId) {
    socket.emit("error", { message: "Unauthorized" });
    socket.disconnect();
    return;
  }

  socket.userId = userId;

  // ==============================
  // 🔥 JOIN BOARD
  // ==============================
  socket.on("join-board", async ({ boardId, name }) => {
    try {
      if (!boardId) return;

      const board = await Board.findById(boardId);
      if (!board) {
        return socket.emit("error", { message: "Board not found" });
      }

      const meta = await BoardUserMeta.findOne({
        boardId,
        userId: socket.userId,
      });

      if (!meta) {
        return socket.emit("error", { message: "Access denied" });
      }

      socket.join(boardId);

      const ydoc = getYDoc(boardId);

      if (board.documentState) {
        Y.applyUpdate(ydoc, new Uint8Array(board.documentState));
      }

      const state = Y.encodeStateAsUpdate(ydoc);

      socket.emit("yjs-init", state);
      socket.emit("canvas-init", board.canvasState || { objects: [] });

      addUser(boardId, {
        userId: socket.userId,
        name,
        role: meta.role,
        socketId: socket.id,
      });

      io.to(boardId).emit("presence-update", getUsers(boardId));
    } catch (err) {
      console.error("Join error:", err.message);
    }
  });

  // ==============================
  // 🔥 YJS UPDATE
  // ==============================
  socket.on("yjs-update", async (payload) => {
    try {
      if (isRateLimited(socket.id)) return;

      const { boardId } = payload;
      if (!boardId) return;

      const meta = await BoardUserMeta.findOne({
        boardId,
        userId: socket.userId,
      });

      if (!meta || meta.role === "viewer") return;

      handleYjsUpdate(socket, payload);
    } catch (err) {
      console.error("YJS error:", err.message);
    }
  });

  // ==============================
  // 🔥 CANVAS UPDATE
  // ==============================
  socket.on("canvas-update", async ({ boardId, state }) => {
    try {
      if (!boardId || !state) return;
      if (isRateLimited(socket.id)) return;

      const meta = await BoardUserMeta.findOne({
        boardId,
        userId: socket.userId,
      });

      if (!meta || meta.role === "viewer") return;

      await Board.findByIdAndUpdate(boardId, {
        canvasState: state,
      });

      socket.to(boardId).emit("canvas-update", state);
    } catch (err) {
      console.error("Canvas error:", err.message);
    }
  });

  // ==============================
  // 🔥 CURSOR MOVE
  // ==============================
  socket.on("cursor-move", ({ boardId, x, y }) => {
    if (!boardId) return;
    if (isRateLimited(socket.id)) return;

    socket.to(boardId).emit("cursor-move", {
      socketId: socket.id,
      x,
      y,
    });
  });

  // ==============================
  // 🔥 CHAT
  // ==============================
  socket.on("chat-message", ({ boardId, message }) => {
    if (!boardId || !message) return;

    socket.to(boardId).emit("chat-message", {
      id: `${socket.id}-${Date.now()}`,
      author: socket.userId,
      message: message.trim().slice(0, 500),
      createdAt: new Date().toISOString(),
    });
  });

  // ==============================
  // 🔥 LEAVE BOARD
  // ==============================
  socket.on("leave-board", ({ boardId }) => {
    if (!boardId) return;

    socket.leave(boardId);
    removeUser(socket.id);

    io.to(boardId).emit("presence-update", getUsers(boardId));
  });

  // ==============================
  // 🔥 DISCONNECT
  // ==============================
  socket.on("disconnecting", () => {
    console.log("❌ Disconnect:", socket.id);

    const rooms = Array.from(socket.rooms);

    removeUser(socket.id);
    delete rateLimitMap[socket.id];

    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("presence-update", getUsers(room));
      }
    });
  });
};