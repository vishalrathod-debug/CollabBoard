// sockets/handlers/drawHandler.js

const Board = require("../../models/Board");

const boardState = {};
const saveTimers = {};

const SAVE_DELAY = 5000;

function triggerSave(boardId) {
  if (saveTimers[boardId]) {
    clearTimeout(saveTimers[boardId]);
  }

  saveTimers[boardId] = setTimeout(() => {
    saveBoardToDB(boardId);
  }, SAVE_DELAY);
}

async function saveBoardToDB(boardId) {
  try {
    const data = boardState[boardId];
    if (!data) return;

    await Board.findByIdAndUpdate(boardId, {
      documentState: data,
      updatedAt: new Date(),
    });

    console.log("💾 Board saved:", boardId);
  } catch (err) {
    console.error("Save error:", err.message);
  }
}

function handleDraw(socket, { boardId, data }) {
  if (!boardId || !data) return;

  // store latest state
  boardState[boardId] = data;

  // broadcast
  socket.to(boardId).emit("draw", data);

  // trigger debounced save
  triggerSave(boardId);
}

module.exports = { handleDraw };