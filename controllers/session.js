const User = require("../models/user");

exports.index = (req, res) => {
  if (req.session.user)
    return res.send(
      JSON.stringify({
        _id: req.session.user._id,
        username: req.session.user.username,
      })
    );
  res.status(204);
};

exports.create = (req, res, getEncryptedPassword, userModel = User) => {
  const encryptedPassword = getEncryptedPassword(req.body.password);
  userModel.findOne({ username: req.body.username }, (err, user) => {
    if (err || encryptedPassword !== user.password) return res.status(401);
    res.send(JSON.stringify({ _id: user._id, username: user.username }));
  });
};

exports.destroy = (req, res) => {
  if (req.session.user && req.cookies.user_sid) res.clearCookie("user_sid");
};
