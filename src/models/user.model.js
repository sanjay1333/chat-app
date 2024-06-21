const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const createError = require("http-errors");

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    contactNumber: { type: String, required: false },
    email: { type: String, required: false },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  const existingUser = await User.findOne(
    {
      $or: [{ userName: user.userName }],
    },

    { userName: 1 }
  );

  if (existingUser) {
    next(createError.Conflict(`User is already been registered`));
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
