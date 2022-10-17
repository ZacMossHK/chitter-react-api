import * as peepsController from "../../controllers/peeps";

let res;
describe("Peeps controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
  });
  it("gets the latest 50 peeps", async () => {
    const peepsModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

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
    peepsModel.limit.mockReturnValueOnce(peeps);
    await peepsController.index({}, res, peepsModel);
    expect(peepsModel.find).toHaveBeenCalled();
    expect(peepsModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(peepsModel.limit).toHaveBeenCalledWith(50);
    expect(res.json).toHaveBeenCalledWith(peeps);
  });

  it("gets a single peep", async () => {
    const peepsModel = {
      findOne: jest.fn(),
    };
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
    peepsModel.findOne.mockReturnValueOnce(peep);
    await peepsController.show(req, res, peepsModel);
    expect(peepsModel.findOne).toHaveBeenCalledWith({ _id: req.params.peepId });
    expect(res.json).toHaveBeenCalledWith(peep);
  });

  it("destroys a single peep", async () => {
    const peepsModel = { findOneAndDelete: jest.fn() };
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 2 } },
    };
    peepsModel.findOneAndDelete.mockReturnValueOnce({ _id: 1 });
    await peepsController.destroy(req, res, peepsModel);
    expect(peepsModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: req.params.peepId,
      userId: req.session.user._id,
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("returns 400 status if findOneAndDelete throws an error", async () => {
    const peepsModel = { findOneAndDelete: jest.fn() };
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 2 } },
    };
    peepsModel.findOneAndDelete.mockReturnValueOnce(new Error("CastError"));
    await peepsController.destroy(req, res, peepsModel);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
