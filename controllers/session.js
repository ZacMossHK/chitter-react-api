const User = require("../models/user");

// do we need this?
exports.index = (req, res) => {
  if (req.session.user)
    return res.json({
      _id: req.session.user._id,
      username: req.session.user.username,
    });
  res.sendStatus(204);
};

exports.create = (req, res, getEncryptedPassword, userModel = User) => {
  const encryptedPassword = getEncryptedPassword(req.body.session.password);
  userModel.findOne({ username: req.body.session.username }, (err, user) => {
    if (err || encryptedPassword !== user.password) return res.sendStatus(403);
    res.status(201).json({ _id: user._id, username: user.username });
  });
};

exports.destroy = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.sendStatus(204);
  }
};
