const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  createdAt: Date,
});

const User = mongoose.model("User", UserSchema);
User.createIndexes();

module.exports = User;
