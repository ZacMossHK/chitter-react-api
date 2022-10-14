import * as sessionController from "../../controllers/session";
const User = require("../../models/user");
require("../mongodb_helper");
let res;

describe("Session controller", () => {
  beforeEach((done) => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
    };
    User.deleteMany(() => {
      done();
    });
  });
  it("getUser returns an null value in the returned object when not logged in", () => {
    sessionController.index({ session: {} }, res);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
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
    expect(res.json).toHaveBeenCalledWith({ _id: 0, username: "someone" });
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
    expect(res.json).toHaveBeenCalledWith({ _id: 1, username: "one" });
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
    expect(res.json).toHaveBeenCalledWith({ _id: 2, username: "red" });
  });

  it("create logs in if user exists and their password matches", () => {
    const req = {
      session: {},
      body: { session: { username: "username", password: "password" } },
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
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: "id", username: "username" });
  });

  it("create sends a 403 status if password is wrong", () => {
    const req = {
      session: {},
      body: { session: { username: "username", password: "otherpassword" } },
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
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("create sends a 403 status if username doesn't exist", () => {
    const req = {
      session: {},
      body: { session: { username: "username", password: "password" } },
    };
    const mockUser = {
      findOne: jest.fn((query, callback) => callback("Error")),
    };
    const getEncryptedPassword = jest.fn();
    getEncryptedPassword.mockReturnValueOnce("108l34jk");
    sessionController.create(req, res, getEncryptedPassword, mockUser);
    expect(getEncryptedPassword).toHaveBeenCalledWith("password");
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("destroy logs the user out", () => {
    const req = {
      session: { user: "object" },
      cookies: { user_sid: "0lkj243" },
    };
    sessionController.destroy(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith("user_sid");
  });

  it("destroy doesn't do anything if user_sid doesn't exist and session does", () => {
    const req = {
      session: { user: "object" },
      cookies: {},
    };
    sessionController.destroy(req, res);
    expect(res.clearCookie).not.toHaveBeenCalled();
  });

  it("destroy doesn't do anything if session.user doesn't exist but user_sid does", () => {
    const req = {
      session: {},
      cookies: { user_sid: "0lkj243" },
    };
    sessionController.destroy(req, res);
    expect(res.clearCookie).not.toHaveBeenCalled();
  });
});
