import * as sessionController from "../../controllers/session";
let res;

describe("Session controller", () => {
  beforeEach(() => {
    res = { send: jest.fn() };
  });
  it("getUser returns an null value in the returned object when not logged in", () => {
    sessionController.index({ session: {} }, res);
    expect(res.send).toHaveBeenCalledWith(JSON.stringify({ user: null }));
  });

  it("getUser returns a user object if session exists", () => {
    const sessionObj = {
      user: {
        username: "someone",
        email: "someoneelse",
        password: "password",
        peeps: [],
      },
    };
    const req = {
      session: sessionObj,
    };
    sessionController.index(req, res);
    expect(res.send).toHaveBeenCalledWith(JSON.stringify(sessionObj));
  });

  it("getUser returns a user object if session user exists", () => {
    const sessionObj = {
      user: {
        username: "one",
        email: "two",
        password: "password",
        peeps: [],
      },
    };
    const req = {
      session: sessionObj,
    };
    sessionController.index(req, res);
    expect(res.send).toHaveBeenCalledWith(JSON.stringify(sessionObj));
  });

  it("getUser returns a user object if session user exists", () => {
    const sessionObj = {
      user: {
        username: "red",
        email: "blue",
        password: "password",
        peeps: [],
      },
    };
    const req = {
      session: sessionObj,
    };
    sessionController.index(req, res);
    expect(res.send).toHaveBeenCalledWith(JSON.stringify(sessionObj));
  });
});
