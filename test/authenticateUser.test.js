const authenticateUser = require("../public/javascripts/authenticateUser");

let res, next;

describe("authenticateUser", () => {
  beforeEach(() => {
    res = { sendStatus: jest.fn() };
    next = jest.fn();
  });
  it("calls next when session id matches the cookie user_sid", () => {
    const req = {
      cookies: { user_sid: "s:123.123" },
      session: { id: "123" },
    };
    authenticateUser(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 error if they don't match", () => {
    const req = {
      cookies: { user_sid: "s:123.123" },
      session: { id: "456" },
    };
    authenticateUser(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("returns 403 error if no cookie  was provided", () => {
    const req = {
      session: { id: "123" },
    };
    authenticateUser(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
