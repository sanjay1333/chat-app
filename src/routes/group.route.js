const express = require("express");
const router = express.Router();
const Group = require("../models/group.model.js");
const User = require("../models/user.model.js");
const { authenticateToken } = require("../middlewares/auth.middleware.js");

// Create a new group
router.post("/create", authenticateToken, async (req, res) => {
  const { name } = req.body;
  const group = new Group({
    name,
    admin: req.user.userName,
    members: [req.user.userName],
  });

  await group.save();
  res.redirect("/groups");
});

// Add a member to the group
router.post("/:groupId/add", authenticateToken, async (req, res) => {
  const groupId = req.params.groupId;
  const { memberId } = req.body;
  const group = await Group.findOne({ name: groupId });

  if (group && group.admin == req.user.userName) {
    group.members.push(memberId);
    await group.save();
  }

  res.redirect("/groups");
});

// Remove a member from the group
router.post("/:groupId/remove", authenticateToken, async (req, res) => {
  const groupId = req.params.groupId;
  const { memberId } = req.body;
  const group = await Group.findById(groupId);

  if (group && group.admin.equals(req.user.id)) {
    group.members.pull(memberId);
    await group.save();
  }

  res.redirect("/groups");
});

module.exports = router;
