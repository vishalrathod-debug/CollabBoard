const express = require("express");
const { getMembers, inviteMember, updateMemberRole, removeMember } = require("../controllers/teamController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/:boardId/members", authMiddleware, getMembers);
router.post("/:boardId/invite", authMiddleware, inviteMember);
router.patch("/:boardId/member/:userId", authMiddleware, updateMemberRole);
router.delete("/:boardId/member/:userId", authMiddleware, removeMember);

module.exports = router;