import * as usersController from "../../controllers/users";
import bcrypt from "bcrypt";
import User from "../../models/user";

jest.mock("bcrypt");
const bcryptHash = bcrypt.hash;
jest.mock("../../models/user");

let res;

describe("Users controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    bcryptHash.mockReset();
    User.mockReset();
  });

  it("create creates a new user", async () => {
    const req = {
      session: {},
      body: {
        user: {
          username: "username",
          password: "password",
          email: "email@email.com",
        },
      },
    };
    User.mockImplementation(() => {
      return {
        save: jest.fn(() => {
          return {
            _id: 1,
            username: "username",
            password: "khj234jl08",
            email: "email@email.com",
          };
        }),
      };
    });
    bcryptHash.mockResolvedValue("khj234jl08");
    await usersController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: 1, username: "username" });
  });

  it("create sends a 400 status if the username or email already exist", async () => {
    const req = {
      session: {},
      body: {
        user: {
          username: "username",
          password: "password",
          email: "email@email.com",
        },
      },
    };

    User.mockImplementation(() => {
      return {
        save: jest.fn(() => {
          throw new Error("MongoServerError");
        }),
      };
    });

    await usersController.create(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it("create sends a 400 status and object if email has invalid characters", () => {
    const req = {
      session: {},
      body: {
        user: {
          username: "username^^!!!£$%",
          password: "password",
          email: "email@email.com",
        },
      },
    };

    usersController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ invalidCharsUsername: true });
  });

  it("create sends a 400 status and object if email has invalid characters", () => {
    const req = {
      session: {},
      body: {
        user: {
          username: "username",
          password: "password",
          email: "ema%%%%%il@e^^^^mail.com",
        },
      },
    };

    usersController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ invalidCharsEmail: true });
  });

  it("create sends a 400 status and object if both username and email have invalid characters", () => {
    const req = {
      session: {},
      body: {
        user: {
          username: "username^^^^&&",
          password: "password",
          email: "ema%%%%%il@e^^^^mail.com",
        },
      },
    };

    usersController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      invalidCharsUsername: true,
      invalidCharsEmail: true,
    });
  });
});
