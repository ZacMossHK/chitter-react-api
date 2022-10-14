exports.create = (req, res, getEncryptedPassword, userModel) => {
  req.body.user.password = getEncryptedPassword(req.body.user.password);
  if (!req.body.user.username.match(/^[\p{L}\p{N}]*$/u))
    return res.status(403).json({ invalidCharsUsername: true });
  new userModel(req.body.user).save((err, user) => {
    if (err && err.toString().includes("MongoServerError"))
      return res.sendStatus(401);
    res.status(201).json({ _id: user._id, username: user.username });
  });
};
