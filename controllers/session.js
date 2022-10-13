getUser = (req, res) => {
  if (!req.session) return res.send(JSON.stringify({ user: null }));
  res.send(JSON.stringify({ user: req.session.user }));
};

module.exports = getUser;
