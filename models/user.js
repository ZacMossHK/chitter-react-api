const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  peeps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Peep" }],
});
UserSchema.index({ userId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model("User", UserSchema);
// User.createIndexes();

module.exports = User;
