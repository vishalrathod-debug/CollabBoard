const Y = require("yjs");

const { getYDoc } = require("../yjsStore");
const { scheduleSave } = require("../saveManager");

// ==============================
// 🔥 HANDLE YJS UPDATE
// ==============================
function handleYjsUpdate(socket, payload) {
  try {
    const { boardId, update } = payload;

    // 🔹 Basic validation
    if (!boardId || !update) return;

    const ydoc = getYDoc(boardId);

    if (!ydoc) {
      console.error("❌ YDoc not found for board:", boardId);
      return;
    }

    // 🔥 SAFE CONVERSION (important)
    let safeUpdate = update;

    if (!(update instanceof Uint8Array)) {
      safeUpdate = new Uint8Array(update);
    }

    // 🔹 Apply update
    Y.applyUpdate(ydoc, safeUpdate);

    // 🔹 Broadcast to others (not sender)
    socket.to(boardId).emit("yjs-update", safeUpdate);

    // 🔥 Schedule DB save (debounced)
    scheduleSave(boardId);

  } catch (error) {
    console.error("YJS Handler Error:", error.message);
  }
}

module.exports = { handleYjsUpdate };