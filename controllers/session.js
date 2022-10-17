const User = require("../models/user");
const bcrypt = require("bcrypt");
// do we need this?
exports.index = (req, res) => {
  if (req.session && req.session.user)
    return res.json({
      _id: req.session.user._id,
      username: req.session.user.username,
    });
  res.sendStatus(204);
};

exports.create = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.session.username,
    });
    const result = await bcrypt.compare(
      req.body.session.password,
      user.password
    );
    if (!result) throw new Error("Password is wrong");
    res.status(201).json({ _id: user._id, username: user.username });
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};

exports.destroy = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.sendStatus(204);
  }
};
