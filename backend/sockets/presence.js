// ==============================
// 🔥 IN-MEMORY PRESENCE STORE (OPTIMIZED)
// ==============================

// boardId -> { userId: { userId, name, role, socketId } }
const boardUsers = {};

// socketId -> boardId
const socketToBoard = {};

// ==============================
// 🔥 ADD USER
// ==============================
function addUser(boardId, user) {
  if (!boardId || !user || !user.socketId || !user.userId) return;

  // create board entry if not exists
  if (!boardUsers[boardId]) {
    boardUsers[boardId] = {};
  }

  // 🔥 prevent duplicate USER (not socket)
  boardUsers[boardId][user.userId] = {
    userId: user.userId,
    name: user.name,
    role: user.role,
    socketId: user.socketId,
  };

  // 🔥 map socket → board
  socketToBoard[user.socketId] = boardId;
}

// ==============================
// 🔥 REMOVE USER (O(1))
// ==============================
function removeUser(socketId) {
  if (!socketId) return;

  const boardId = socketToBoard[socketId];
  if (!boardId || !boardUsers[boardId]) return;

  const users = boardUsers[boardId];

  // 🔥 find user by socketId
  for (const userId in users) {
    if (users[userId].socketId === socketId) {
      delete users[userId];
      break;
    }
  }

  // 🔥 clean mapping
  delete socketToBoard[socketId];

  // 🔥 remove empty board
  if (Object.keys(boardUsers[boardId]).length === 0) {
    delete boardUsers[boardId];
  }
}

// ==============================
// 🔥 GET USERS (ARRAY FOR UI)
// ==============================
function getUsers(boardId) {
  if (!boardId || !boardUsers[boardId]) return [];

  return Object.values(boardUsers[boardId]);
}

// ==============================
// 🔥 OPTIONAL: CLEANUP (SAFETY)
// ==============================
function cleanupEmptyBoards() {
  for (const boardId in boardUsers) {
    if (Object.keys(boardUsers[boardId]).length === 0) {
      delete boardUsers[boardId];
    }
  }
}

// run every 60 sec (optional safety)
setInterval(cleanupEmptyBoards, 60000);

// ==============================
module.exports = {
  addUser,
  removeUser,
  getUsers,
};