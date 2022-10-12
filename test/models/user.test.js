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
});
