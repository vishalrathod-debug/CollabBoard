const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");
const User = require("../models/User");

const invite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { boardId, email, role } = req.body;

    // 🔹 1. Validate input
    if (!boardId || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "boardId, email and role are required",
      });
    }

    const validRoles = ["admin", "editor", "viewer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
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

    // 🔹 3. Check inviter is admin
    const inviter = await BoardUserMeta.findOne({
      userId,
      boardId,
    });

    if (!inviter || inviter.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can invite users",
      });
    }

    // 🔹 4. Find target user
    const targetUser = await User.findOne({ email });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔹 5. Prevent duplicate
    const existing = await BoardUserMeta.findOne({
      userId: targetUser._id,
      boardId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already in board",
      });
    }

    // 🔹 6. Create relation
    await BoardUserMeta.create({
      userId: targetUser._id,
      boardId,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User invited successfully",
    });

  } catch (error) {
    console.error("Invite Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = invite