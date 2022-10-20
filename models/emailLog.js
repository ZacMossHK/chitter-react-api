const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  peepId: { type: mongoose.Schema.Types.ObjectId, ref: "Peep" },
  createdAt: Date,
  successful: Boolean,
});
EmailLogSchema.index({ userId: 1, peepId: 1 }, { unique: true });
const EmailLog = mongoose.model("EmailLog", EmailLogSchema);

module.exports = EmailLog;
