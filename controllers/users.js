const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  if (validateFields(req, res)) {
    console.log(`attempting to create user ${req.body.user.username}...`);
    req.body.user.password = await bcrypt.hash(req.body.user.password, 10);
    try {
      console.log(req.body.user);
      const user = await new User(req.body.user).save();
      console.log("user saved!");
      return res.status(201).json({ _id: user._id, username: user.username });
    } catch (e) {
      console.log(e);
      return res.sendStatus(400);
    }
  }
};

exports.test = async (req, res) => {
  return res.json({ word: "ping" });
};

const validateFields = (req, res) => {
  const invalidUsernameObj = validateUsername(req);
  const invalidEmailObj = validateEmail(req);
  if (invalidUsernameObj || invalidEmailObj)
    res.status(400).json({ ...invalidUsernameObj, ...invalidEmailObj });
  return !(invalidUsernameObj || invalidEmailObj);
};

const validateUsername = (req) => {
  if (!req.body.user.username.match(/^[\p{L}\p{N}]*$/u))
    return { invalidCharsUsername: true };
};

const validateEmail = (req) => {
  const emailRegex =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!req.body.user.email.match(emailRegex))
    return { invalidCharsEmail: true };
};
