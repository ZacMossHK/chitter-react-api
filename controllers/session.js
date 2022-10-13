exports.index = (req, res) => {
  let result = null;
  if (req.session.user)
    result = { _id: req.session.user._id, username: req.session.user.username };
  res.send(JSON.stringify({ user: result }));
};

exports.create = () => {};
