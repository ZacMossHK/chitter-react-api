const mongoose = require("mongoose");

const PeepSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  createdAt: Date,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
});

const Peep = mongoose.model("Peep", PeepSchema);
Peep.createIndexes();

module.exports = Peep;
