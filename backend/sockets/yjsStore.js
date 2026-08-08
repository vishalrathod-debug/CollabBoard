const Y = require("yjs");

const docs = {}; // boardId → Y.Doc

function getYDoc(boardId) {
  if (!docs[boardId]) {
    docs[boardId] = new Y.Doc();
  }
  return docs[boardId];
}

module.exports = { getYDoc };