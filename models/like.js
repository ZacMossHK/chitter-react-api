const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
});

const Like = mongoose.model("Like", LikeSchema);
Like.createIndexes();

module.exports = Like;
