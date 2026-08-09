const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await BoardUserMeta.findOne({ userId: req.user.id, boardId: id });

    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only an admin can delete this board" });
    }

    const board = await Board.findByIdAndDelete(id);
    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }

    await BoardUserMeta.deleteMany({ boardId: id });
    return res.json({ success: true, message: "Board deleted successfully" });
  } catch (error) {
    console.error("Delete Board Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = deleteBoard;
