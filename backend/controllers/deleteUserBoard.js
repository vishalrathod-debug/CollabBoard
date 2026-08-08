const deleteUserInBoard = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { boardId, userId: targetUserId } = req.params;

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
        message: "Only admin can remove users",
      });
    }

    // 🔹 Prevent removing yourself (optional but safer)
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself",
      });
    }

    // 🔹 Check target user exists
    const targetUser = await BoardUserMeta.findOne({
      userId: targetUserId,
      boardId,
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in board",
      });
    }

    // 🔹 Prevent removing last admin
    if (targetUser.role === "admin") {
      const adminCount = await BoardUserMeta.countDocuments({
        boardId,
        role: "admin",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot remove last admin",
        });
      }
    }

    // 🔹 Remove user
    await BoardUserMeta.deleteOne({
      userId: targetUserId,
      boardId,
    });

    return res.status(200).json({
      success: true,
      message: "User removed from board",
    });

  } catch (error) {
    console.error("Remove User Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = deleteUserInBoard