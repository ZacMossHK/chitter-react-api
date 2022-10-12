const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
});
module.exports = User;
