import * as sessionController from "../../controllers/session";
import bcrypt from "bcrypt";
import User from "../../models/user";
require("../mongodb_helper");
let res;
jest.mock("bcrypt");
const bcryptCompare = bcrypt.compare;
jest.mock("../../models/user");

describe("Session controller", () => {
  beforeEach(async () => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
    };
    bcryptCompare.mockReset();
    User.mockReset();
  });

  it("create logs in if user exists and their password matches", async () => {
    const req = {
      session: {},
      cookies: { user_sid: 1 },
      body: { session: { username: "username", password: "password" } },
    };

    User.findOne.mockResolvedValue({
      _id: "id",
      username: "username",
      password: "108l34jk",
    });
    bcryptCompare.mockResolvedValue(true);
    await sessionController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "id",
      username: "username",
    });
  });

  it("create sends a 403 status if password is wrong", async () => {
    const req = {
      session: {},
      body: { session: { username: "username", password: "otherpassword" } },
    };
    User.findOne.mockResolvedValue({
      _id: "id",
      username: "username",
      password: "108l34jk",
    });
    bcryptCompare.mockResolvedValue(false);
    await sessionController.create(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("create sends a 403 status if username doesn't exist", async () => {
    const req = {
      session: {},
      body: { session: { username: "username", password: "password" } },
    };
    const mockUser = {
      findOne: jest.fn(() => {
        throw new Error("CastError");
      }),
    };
    await sessionController.create(req, res, mockUser);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("destroy logs the user out", () => {
    const req = {
      session: { user: "object" },
      cookies: { user_sid: "0lkj243" },
    };
    sessionController.destroy(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith("user_sid");
    expect(res.sendStatus).toHaveBeenCalledWith(204);
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
