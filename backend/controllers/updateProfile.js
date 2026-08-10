const User = require("../models/User");

// ==============================
// 🔥 UPDATE PROFILE
// ==============================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 from auth middleware

    let { name, bio, avatar, theme } = req.body;

    // ==========================
    // 🔒 VALIDATION
    // ==========================
    const updateData = {};

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name too short",
        });
      }
      updateData.name = name.trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio.trim().slice(0, 200);
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    if (theme !== undefined) {
      if (!["light", "dark"].includes(theme)) {
        return res.status(400).json({
          success: false,
          message: "Invalid theme",
        });
      }
      updateData["preferences.theme"] = theme;
    }

    // ==========================
    // 🔥 UPDATE USER
    // ==========================
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================
    // ✅ RESPONSE
    // ==========================
    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (error) {
    console.error("Update Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = updateProfile