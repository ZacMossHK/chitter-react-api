authenticateUser = (req, res, next) => {
  if (
    req.cookies.user_sid &&
    req.headers.Authorization &&
    req.headers.Authorization.split(" ")[1] === req.cookies.user_sid.toString()
  )
    return next();
  res.sendStatus(403);
};

module.exports = authenticateUser;
