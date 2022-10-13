exports.create = (req, res, userModel) => {
  new userModel(req.body).save((err, user) => {
    if (err && err.toString().includes("MongoServerError"))
      return res.status(401);
    res.send(JSON.stringify({ _id: user._id, username: user.username }));
  });
};
