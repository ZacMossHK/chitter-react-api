authenticateUser = (req, res, next) => {
  try {
    if (req.cookies.user_sid.split(".")[0].slice(2) === req.session.id)
      return next();
  } catch {}
  res.sendStatus(403);
};

module.exports = authenticateUser;
