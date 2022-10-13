getUser = (req, res) => {
  if (!req.session) return res.send(JSON.stringify({ user: null }));
  if (req.session.user.username === "one")
    return res.send(
      JSON.stringify({
        user: {
          username: "one",
          email: "two",
          password: "password",
          peeps: [],
        },
      })
    );
  res.send(
    JSON.stringify({
      user: {
        username: "someone",
        email: "someoneelse",
        password: "password",
        peeps: [],
      },
    })
  );
};

module.exports = getUser;
