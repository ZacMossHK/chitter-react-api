exports.create = (req, res, getEncryptedPassword, userModel) => {
  if (!req.body.user.username.match(/^[\p{L}\p{N}]*$/u))
    return res.status(403).json({ invalidCharsUsername: true });
  const emailRegex =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!req.body.user.email.match(emailRegex))
    return res.status(403).json({ invalidCharsEmail: true });
  req.body.user.password = getEncryptedPassword(req.body.user.password);
  new userModel(req.body.user).save((err, user) => {
    if (err && err.toString().includes("MongoServerError"))
      return res.sendStatus(401);
    res.status(201).json({ _id: user._id, username: user.username });
  });
};
