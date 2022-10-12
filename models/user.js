const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  peeps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Peep" }],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
