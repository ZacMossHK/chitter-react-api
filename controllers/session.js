getUser = (req, res) => {
  if (!req.session) return res.send(JSON.stringify({ user: null }));
  if (req.session.user.username === "someone")
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
