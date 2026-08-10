const BoardUserMeta = require("../models/BoardUserMeta");
const User = require("../models/User");

// 🔹 GET MEMBERS

exports.getMembers = async (req, res) => {
  try {
    const { boardId } = req.params;

    const members = await BoardUserMeta.find({ boardId })
      .populate("userId", "name email avatar");

    res.json({
      success: true,
      members,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// 🔹 INVITE MEMBER
exports.inviteMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = await BoardUserMeta.findOne({
      boardId,
      userId: user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Already a member" });
    }

    const member = await BoardUserMeta.create({
      boardId,
      userId: user._id,
      role: role || "viewer",
    });

    res.json({
      success: true,
      member,
    });
  } catch (err) {
    res.status(500).json({ message: "Invite failed" });
  }
};

// 🔹 UPDATE ROLE
exports.updateMemberRole = async (req, res) => {
  try {
    const { boardId, userId } = req.params;
    const { role } = req.body;

    const updated = await BoardUserMeta.findOneAndUpdate(
      { boardId, userId },
      { role },
      { new: true }
    );

    res.json({
      success: true,
      updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// 🔹 REMOVE MEMBER
exports.removeMember = async (req, res) => {
  try {
    const { boardId, userId } = req.params;

    await BoardUserMeta.findOneAndDelete({
      boardId,
      userId,
    });

    res.json({
      success: true,
      message: "Removed",
    });
  } catch (err) {
    res.status(500).json({ message: "Remove failed" });
  }
};