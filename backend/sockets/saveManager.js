const Y = require("yjs");
const Board = require("../models/Board");
const { getYDoc } = require("./yjsStore");

// ==============================
// 🔥 SAVE TIMER STORE
// ==============================
const saveTimers = {};
const SAVE_DELAY = 5000; // 5 sec debounce

// ==============================
// 🔥 SCHEDULE SAVE
// ==============================
function scheduleSave(boardId) {
  if (!boardId) return;

  // 🔹 Clear previous timer
  if (saveTimers[boardId]) {
    clearTimeout(saveTimers[boardId]);
  }

  // 🔹 Set new timer
  saveTimers[boardId] = setTimeout(() => {
    saveToDB(boardId);
  }, SAVE_DELAY);
}

// ==============================
// 🔥 SAVE TO DATABASE
// ==============================
async function saveToDB(boardId) {
  try {
    if (!boardId) return;

    const board = await Board.findById(boardId);
    if (!board) {
      console.warn("⚠️ Board not found, skipping save:", boardId);
      return;
    }

    const ydoc = getYDoc(boardId);

    if (!ydoc) {
      console.warn("⚠️ YDoc not found, skipping save:", boardId);
      return;
    }

    // 🔹 Encode CRDT state
    const state = Y.encodeStateAsUpdate(ydoc);

    // 🔹 Save safely
    board.documentState = Buffer.from(state);
    board.updatedAt = new Date();

    await board.save();

    console.log("💾 Yjs snapshot saved:", boardId);

    // 🔥 Clean timer after execution
    delete saveTimers[boardId];

  } catch (error) {
    console.error("❌ Save error:", error.message);
  }
}

module.exports = { scheduleSave };