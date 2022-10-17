import * as peepsController from "../../controllers/peeps";
import Peep from "../../models/peep";
jest.mock("../../models/peep");
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
});
