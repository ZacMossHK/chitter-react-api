const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");

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
    req.session.user = user;
    res.status(201).json({
      _id: user._id,
      username: user.username,
    });
  } catch (e) {
    res.sendStatus(403);
  }
};

exports.destroy = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.sendStatus(204);
  }
};
