const authenticateUser = require("../public/javascripts/authenticateUser");

let res, next;

describe("authenticateUser", () => {
  beforeEach(() => {
    res = { sendStatus: jest.fn() };
    next = jest.fn();
  });
  it("calls next when userSid matches the authorization token", () => {
    const req = {
      cookies: { user_sid: 1 },
      headers: { Authorization: "Token 1" },
    };
    authenticateUser(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 error if they don't match", () => {
    const req = {
      cookies: { user_sid: 1 },
      headers: { Authorization: "Token 2" },
    };
    authenticateUser(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("returns 403 error if no Authorization header was provided", () => {
    const req = {
      cookies: { user_sid: 1 },
      headers: {},
    };
    authenticateUser(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
