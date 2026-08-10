const BoardActivity = require("../models/BoardActivity");

// ==============================
// 📥 GET ACTIVITY
// ==============================
exports.getActivity = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "BoardId required",
      });
    }

    const activities = await BoardActivity.find({ boardId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      activities,
    });

  } catch (error) {
    console.error("Activity error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
};