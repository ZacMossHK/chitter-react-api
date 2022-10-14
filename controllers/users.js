exports.create = (req, res, userModel) => {
  new userModel(req.body).save((err, user) => {
    if (err && err.toString().includes("MongoServerError"))
      return res.sendStatus(401);
    res.status(201).json({ _id: user._id, username: user.username });
  });
};