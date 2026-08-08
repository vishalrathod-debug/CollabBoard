const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const joinBoard = async (req, res) => {
  try {
    const userId = req.user.id;

    const { roomId } = req.body;

    // 🔹 Validate
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    // 🔹 Find board using roomId
    const board = await Board.findOne({ roomId });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // 🔹 Check if already joined
    const existing = await BoardUserMeta.findOne({
      userId,
      boardId: board._id,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already joined",
        board,
      });
    }

    // 🔹 Add user to board
    await BoardUserMeta.create({
      userId,
      boardId: board._id,
      role: "editor",
    });

    return res.status(200).json({
      success: true,
      message: "Joined board successfully",
      board,
    });

  } catch (error) {
    console.error("Join Board Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { joinBoard };