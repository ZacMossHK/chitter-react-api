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

  it("create sends a 401 status if the username or email already exist", () => {
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
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("create sends a 403 status and object if username has special characters", () => {
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

    const mockUser = jest.fn().mockImplementation(() => {});

    usersController.create(req, res, mockGetEncryptedPassword, mockUser);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ invalidCharsEmail: true });
  });
});
