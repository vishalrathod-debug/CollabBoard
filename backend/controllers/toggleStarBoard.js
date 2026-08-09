const BoardUserMeta = require("../models/BoardUserMeta");

const toggleStarBoard = async (req, res) => {
  try {
    const membership = await BoardUserMeta.findOne({
      userId: req.user.id,
      boardId: req.params.id,
    });

    if (!membership) {
      return res.status(404).json({ success: false, message: "Board membership not found" });
    }

    membership.isStarred = !membership.isStarred;
    await membership.save();
    return res.json({ success: true, isStarred: membership.isStarred });
  } catch (error) {
    console.error("Toggle Board Star Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = toggleStarBoard;
