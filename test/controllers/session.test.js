import * as sessionController from "../../controllers/session";
const User = require("../../models/user");
require("../mongodb_helper");
let res;

describe("Session controller", () => {
  beforeEach((done) => {
    res = { send: jest.fn(), status: jest.fn() };
    User.deleteMany(() => {
      done();
    });
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

  it("create logs in if user exists and their password matches", () => {
    const req = {
      session: {},
      body: { username: "username", password: "password" },
    };
    const mockUser = {
      findOne: jest.fn((query, callback) =>
        callback(null, {
          _id: "id",
          username: "username",
          password: "108l34jk",
        })
      ),
    };
    const getEncryptedPassword = jest.fn();
    getEncryptedPassword.mockReturnValueOnce("108l34jk");
    sessionController.create(req, res, getEncryptedPassword, mockUser);
    expect(getEncryptedPassword).toHaveBeenCalledWith("password");
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ _id: "id", username: "username" })
    );
  });

  it("create sends a 501 status if password is wrong", () => {
    const req = {
      session: {},
      body: { username: "username", password: "otherpassword" },
    };
    const mockUser = {
      findOne: jest.fn((query, callback) =>
        callback(null, {
          _id: "id",
          username: "username",
          password: "108l34jk",
        })
      ),
    };
    const getEncryptedPassword = jest.fn();
    getEncryptedPassword.mockReturnValueOnce("1oi1234kj");
    sessionController.create(req, res, getEncryptedPassword, mockUser);
    expect(getEncryptedPassword).toHaveBeenCalledWith("otherpassword");
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
