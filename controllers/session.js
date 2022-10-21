const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  try {
    return await createSession(req, res);
  } catch (e) {
    return res.sendStatus(403);
  }
};

const createSession = async (req, res) => {
  const user = await User.findOne({
    username: req.body.session.username,
  });
  const result = await bcrypt.compare(req.body.session.password, user.password);
  if (!result) throw new Error("Password is wrong");
  req.session.user = user;
  return res.status(201).json({
    _id: user._id,
    username: user.username,
  });
};

exports.destroy = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    return res.sendStatus(204);
  }
};
