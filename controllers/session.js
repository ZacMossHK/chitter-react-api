const User = require("../models/user");

exports.index = (req, res) => {
  let result = null;
  if (req.session.user)
    result = { _id: req.session.user._id, username: req.session.user.username };
  res.send(JSON.stringify({ user: result }));
};

exports.create = (req, res, getEncryptedPassword, userModel = User) => {
  const encryptedPassword = getEncryptedPassword(req.body.password);
  userModel.findOne({ username: req.body.username }, (err, user) => {
    if (err || encryptedPassword !== user.password) return res.status(401);
    res.send(JSON.stringify({ _id: user._id, username: user.username }));
  });
};

exports.delete = (req, res) => {
  res.clearCookie("user_sid");
};
