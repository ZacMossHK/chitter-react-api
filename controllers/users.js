exports.create = (req, res, getEncryptedPassword, userModel) => {
  if (validateFields(req, res)) {
    req.body.user.password = getEncryptedPassword(req.body.user.password);
    new userModel(req.body.user).save((err, user) => {
      if (err && err.toString().includes("MongoServerError"))
        return res.sendStatus(400);
      res.status(201).json({ _id: user._id, username: user.username });
    });
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
