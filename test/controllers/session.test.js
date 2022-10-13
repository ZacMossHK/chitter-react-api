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
    const req = {
      session: {
        user: {
          _id: 0,
          username: "someone",
          email: "someoneelse",
          password: "password",
          peeps: [],
        },
      },
    };
    sessionController.index(req, res);
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ user: { _id: 0, username: "someone" } })
    );
  });

  it("getUser returns a user object if session user exists", () => {
    const req = {
      session: {
        user: {
          _id: 1,
          username: "one",
          email: "two",
          password: "password",
          peeps: [],
        },
      },
    };
    sessionController.index(req, res);
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ user: { _id: 1, username: "one" } })
    );
  });

  it("getUser returns a user object if session user exists", () => {
    const req = {
      session: {
        user: {
          _id: 2,
          username: "red",
          email: "blue",
          password: "password",
          peeps: [],
        },
      },
    };
    sessionController.index(req, res);
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ user: { _id: 2, username: "red" } })
    );
  });

  // it("create logs in a user if their password matches", () => {});
});
