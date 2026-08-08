// ==============================
// 🔥 IN-MEMORY PRESENCE STORE
// ==============================

const boardUsers = {}; 
// structure:
// {
//   boardId: [
//     { userId, name, role, socketId }
//   ]
// }


// ==============================
// 🔥 ADD USER
// ==============================
function addUser(boardId, user) {
  if (!boardId || !user || !user.socketId) return;

  if (!boardUsers[boardId]) {
    boardUsers[boardId] = [];
  }

  // ❌ prevent duplicate socket entries
  const exists = boardUsers[boardId].some(
    (u) => u.socketId === user.socketId
  );

  if (!exists) {
    boardUsers[boardId].push(user);
  }
}


// ==============================
// 🔥 REMOVE USER
// ==============================
function removeUser(socketId) {
  if (!socketId) return;

  for (const boardId in boardUsers) {
    const users = boardUsers[boardId];

    const updatedUsers = users.filter(
      (user) => user.socketId !== socketId
    );

    if (updatedUsers.length !== users.length) {
      boardUsers[boardId] = updatedUsers;

      // 🔥 CLEAN EMPTY ROOM (VERY IMPORTANT)
      if (boardUsers[boardId].length === 0) {
        delete boardUsers[boardId];
      }
    }
  }
}


// ==============================
// 🔥 GET USERS IN BOARD
// ==============================
function getUsers(boardId) {
  if (!boardId) return [];

  return boardUsers[boardId] || [];
}


module.exports = {
  addUser,
  removeUser,
  getUsers,
};