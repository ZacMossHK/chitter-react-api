const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  if (validateFields(req, res)) {
    req.body.user.password = await bcrypt.hash(req.body.user.password, 10);
    try {
      const user = await new User(req.body.user).save();
      res.status(201).json({ _id: user._id, username: user.username });
    } catch {
      res.sendStatus(400);
    }
  }
};

const validateFields = (req, res) => {
  let invalidUsernameObj, invalidEmailObj;
  if (!req.body.user.username.match(/^[\p{L}\p{N}]*$/u))
    invalidUsernameObj = { invalidCharsUsername: true };
  const emailRegex =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!req.body.user.email.match(emailRegex))
    invalidEmailObj = { invalidCharsEmail: true };
  if (invalidUsernameObj || invalidEmailObj)
    return res.status(400).json({ ...invalidUsernameObj, ...invalidEmailObj });
  return true;
};
