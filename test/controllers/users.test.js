import * as usersController from "../../controllers/users";

let res, mockGetEncryptedPassword;

describe("Users controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    mockGetEncryptedPassword = jest.fn(() => "khj234jl08");
  });

  it("create creates a new user", () => {
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
    const mockUser = jest.fn().mockImplementation(() => {
      return {
        save: jest.fn((callback) =>
          callback(null, {
            _id: 1,
            username: "username",
            password: "khj234jl08",
            email: "email@email.com",
          })
        ),
      };
    });
    usersController.create(req, res, mockGetEncryptedPassword, mockUser);
    expect(mockGetEncryptedPassword).toHaveBeenCalledWith("password");
    expect(mockUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: 1, username: "username" });
  });

  it("create sends a 400 status if the username or email already exist", () => {
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

    const mockUser = jest.fn().mockImplementation(() => {
      return {
        save: jest.fn((callback) => callback(new Error("MongoServerError"))),
      };
    });

    usersController.create(req, res, mockGetEncryptedPassword, mockUser);
    expect(mockGetEncryptedPassword).toHaveBeenCalledWith("password");
    expect(mockUser).toHaveBeenCalled();
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
