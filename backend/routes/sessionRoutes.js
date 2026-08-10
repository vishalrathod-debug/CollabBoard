const express = require("express");
const router = express.Router();

const { getUsers } = require("../sockets/presence");
const Board = require("../models/Board");

router.get("/", async (req, res) => {
  try {
    const sessions = [];

    const boards = await Board.find({}).select("title");

    boards.forEach((board) => {
      const users = getUsers(board._id.toString());

      if (users.length > 0) {
        sessions.push({
          boardId: board._id,
          title: board.title,
          users,
          count: users.length,
        });
      }
    });

    res.json({ sessions });
  } catch (err) {
    console.error("Live session error:", err);
    res.status(500).json({ message: "Failed to load sessions" });
  }
});

module.exports = router;