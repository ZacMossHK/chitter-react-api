exports.create = (req, res, userModel) => {
  new userModel(req.body).save((err, user) =>
    res.send(JSON.stringify({ _id: user._id, username: user.username }))
  );
};
