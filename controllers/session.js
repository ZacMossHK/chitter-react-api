exports.getUser = (req, res) => {
  const result = req.session.user ? req.session.user : null;
  res.send(JSON.stringify({ user: result }));
};
