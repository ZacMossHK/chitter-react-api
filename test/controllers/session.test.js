const getUser = require("../../controllers/session");

let res;

describe("Session controller", () => {
  beforeAll(() => {
    res = { send: jest.fn() };
  });
  it("get user returns an null value in the returned object when not logged in", () => {
    getUser({}, res);
    expect(res.send).toHaveBeenCalledWith(JSON.stringify({ user: null }));
  });
});
