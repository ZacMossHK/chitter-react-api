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
      },
      {
        _id: 2,
        userId: 2,
        body: "bar",
        createdAt: new Date(2022, 10, 11),
      },
    ];
    peepsModel.limit.mockReturnValueOnce(peeps);
    await peepsController.index({}, res, peepsModel);
    expect(peepsModel.find).toHaveBeenCalled();
    expect(peepsModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(peepsModel.limit).toHaveBeenCalledWith(50);
    expect(res.json).toHaveBeenCalledWith(peeps);
  });
});
