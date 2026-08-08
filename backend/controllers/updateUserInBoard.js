const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const updateUserInBoard = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { boardId, userId: targetUserId } = req.params;
    const { role } = req.body;

    // 🔹 Validate role
    const validRoles = ["admin", "editor", "viewer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // 🔹 Check board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // 🔹 Check current user is admin
    const currentUser = await BoardUserMeta.findOne({
      userId: currentUserId,
      boardId,
    });

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can change roles",
      });
    }

    // 🔹 Prevent self role change (recommended)
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // 🔹 Check target user exists in board
    const targetUser = await BoardUserMeta.findOne({
      userId: targetUserId,
      boardId,
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in this board",
      });
    }

    // 🔹 Prevent removing last admin
    if (targetUser.role === "admin" && role !== "admin") {
      const adminCount = await BoardUserMeta.countDocuments({
        boardId,
        role: "admin",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot change role of last admin",
        });
      }
    }

    // 🔹 Update role
    targetUser.role = role;
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });

  } catch (error) {
    console.error("Update Role Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = updateUserInBoard