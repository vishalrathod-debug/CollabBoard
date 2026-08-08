const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const getBoardById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 🔹 Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Board ID is required",
      });
    }

    // 🔹 Check board exists
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // 🔹 Check user access
    const access = await BoardUserMeta.findOne({
      userId,
      boardId: board._id,
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 🔹 Response with role
    return res.status(200).json({
      success: true,
      board: {
        id: board._id,
        title: board.title,
        roomId: board.roomId,
        thumbnailUrl: board.thumbnailUrl,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      },
      role: access.role,
    });

  } catch (error) {
    console.error("Get Board Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getBoardById