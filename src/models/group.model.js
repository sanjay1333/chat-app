const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: String }],
  admin: { type: String },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
