const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");

const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Board title is required" });
    }

    const membership = await BoardUserMeta.findOne({ userId: req.user.id, boardId: id });
    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only an admin can rename this board" });
    }

    const board = await Board.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }

    return res.json({ success: true, board });
  } catch (error) {
    console.error("Update Board Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = updateBoard;
