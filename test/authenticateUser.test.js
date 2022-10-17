const authenticateUser = require("../public/javascripts/authenticateUser");

let res, next;

describe("authenticateUser", () => {
  beforeEach(() => {
    res = {};
    next = jest.fn();
  });
  it("calls next when userSid matches the authorization token", () => {
    const req = {
      cookies: { user_sid: 1 },
      headers: { authorization: "Token 1" },
    };
    authenticateUser(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
