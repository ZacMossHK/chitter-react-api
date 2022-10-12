require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {
  beforeEach((done) => {
    User.deleteMany(() => {
      done();
    });
  });

  it("constructs", () => {
    const user = new User({
      username: "someone",
      email: "someone@example.com",
      password: "password",
      peeps: [],
    });
    expect(user.username).toBe("someone");
    expect(user.email).toBe("someone@example.com");
    expect(user.password).toBe("password");
    expect(user.peeps.length).toBe(0);
  });

  it("can list all users", (done) => {
    User.find((err, users) => {
      expect(err).toBeNull();
      expect(users).toEqual([]);
      done();
    });
  });

  it("can save a user", (done) => {
    const user = new User({
      username: "someone",
      email: "someone@example.com",
      password: "password",
      peeps: [],
    });

    user.save((err) => {
      expect(err).toBeNull();

      User.find((err, users) => {
        expect(err).toBeNull();
        expect(users[0].email).toEqual("someone@example.com");
        expect(users[0].password).toEqual("password");
        done();
      });
    });
  });
});
