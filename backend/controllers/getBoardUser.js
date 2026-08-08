const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const getBoardUser = async (req, res) => {
  try {
    const { id: boardId } = req.params;
    const userId = req.user.id;

    // 🔹 1. Validate
    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "Board ID is required",
      });
    }

    // 🔹 2. Check board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // 🔹 3. Access check
    const access = await BoardUserMeta.findOne({
      userId,
      boardId,
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 🔹 4. Get all users in board
    const members = await BoardUserMeta.find({ boardId })
      .populate("userId", "name email avatar") // only needed fields
      .sort({ createdAt: 1 });

    // 🔹 5. Format response
    const users = members.map((item) => ({
      id: item.userId._id,
      name: item.userId.name,
      email: item.userId.email,
      avatar: item.userId.avatar,
      role: item.role,
    }));

    // 🔹 6. Response
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error("Get Board Users Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getBoardUser