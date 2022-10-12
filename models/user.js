const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  username: String,
  email: { type: String, unique: true },
  password: String,
  peeps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Peep" }],
});

const User = mongoose.model("User", UserSchema);
User.createIndexes();

module.exports = User;
