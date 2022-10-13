import * as usersController from "../../controllers/users";

let res;

describe("Users controller", () => {
  beforeEach(() => {
    res = { send: jest.fn() };
  });

  it("create creates a new user", () => {
    const req = {
      session: {},
      body: { username: "username", password: "password", email: "email" },
    };
    const mockUser = jest.fn().mockImplementation(() => {
      return {
        save: jest.fn((callback) =>
          callback(null, {
            _id: 1,
            username: "username",
            password: "password",
            email: "email",
          })
        ),
      };
    });
    usersController.create(req, res, mockUser);
    expect(mockUser).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ _id: 1, username: "username" })
    );
  });
});
