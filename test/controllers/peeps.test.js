import * as peepsController from "../../controllers/peeps";
import Peep from "../../models/peep";
import User from "../../models/user";
import { sendTwilioEmail } from "../../public/javascripts/sendTwilioEmail";
jest.mock("../../models/peep");
jest.mock("../../models/user");
jest.mock("../../public/javascripts/sendTwilioEmail");
let res;

describe("Peeps controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    Peep.mockReset();
  });
  it("gets the latest 50 peeps", async () => {
    const peeps = [
      {
        _id: 1,
        userId: 1,
        body: "foo",
        createdAt: new Date(2022, 10, 12),
        likes: [],
      },
      {
        _id: 2,
        userId: 2,
        body: "bar",
        createdAt: new Date(2022, 10, 11),
        likes: [],
      },
    ];

    Peep.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn(() => peeps),
    }));
    await peepsController.index({}, res);
    expect(res.json).toHaveBeenCalledWith(peeps);
  });

  it("gets a single peep", async () => {
    const peep = {
      _id: 1,
      userId: 1,
      body: "foo",
      createdAt: new Date(2022, 10, 17),
      likes: [],
    };
    const req = {
      params: { peepId: 1 },
    };
    Peep.findOne.mockResolvedValue(peep);
    await peepsController.show(req, res);
    expect(res.json).toHaveBeenCalledWith(peep);
  });

  it("creates a peep", async () => {
    const peep = {
      _id: 1,
      userId: 1,
      body: "foo",
      createdAt: new Date(2022, 10, 18),
      likes: [],
    };
    Peep.mockImplementation(() => {
      return {
        save: jest.fn(() => {
          return peep;
        }),
      };
    });
    const req = {
      body: { peep: { body: "foo" } },
      session: { user: { _id: 1 } },
    };
    User.findOne.mockResolvedValue(() => {
      throw new Error("CastError");
    });
    await peepsController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ peep: peep, taggedUsers: [] });
  });

  it("destroys a single peep", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 2 } },
    };
    Peep.findOneAndDelete.mockResolvedValue({ _id: 1 });
    await peepsController.destroy(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("returns 400 status if findOneAndDelete can't find the matching peep", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 2 } },
    };
    Peep.findOneAndDelete.mockResolvedValue(null);
    await peepsController.destroy(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("returns 201 status with an object containing the tagged users", async () => {
    const peep = {
      _id: 1,
      userId: 1,
      body: "foo",
      createdAt: new Date(2022, 10, 18),
      likes: [],
    };
    Peep.mockImplementation(() => {
      return {
        save: jest.fn(() => {
          return peep;
        }),
      };
    });
    const req = {
      body: { peep: { body: "@Foo" } },
      session: { user: { _id: 1 } },
    };
    User.findOne.mockResolvedValue({
      _id: 2,
      username: "Foo",
      email: "example@example.com",
    });
    sendTwilioEmail.mockResolvedValue(true);
    await peepsController.create(req, res);
    expect(res.json).toHaveBeenCalledWith({
      peep: peep,
      taggedUsers: [{ id: 2, emailSuccess: true }],
    });
  });
});
