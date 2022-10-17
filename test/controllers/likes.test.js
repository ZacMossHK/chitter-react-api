import * as likesController from "../../controllers/likes";

let res;
describe("Likes controller", () => {
  beforeEach(() => {
    res = { json: jest.fn(), sendStatus: jest.fn() };
  });
  it("update adds a like", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 1, username: "foo" } },
    };
    const mockPeepModel = { findOneAndUpdate: jest.fn() };
    const mockLikeModel = jest.fn().mockImplementation(() => {
      return {
        save: jest.fn(() => {
          return {
            _id: 1,
            userId: 1,
            peepId: 1,
            username: "foo",
          };
        }),
      };
    });
    mockPeepModel.findOneAndUpdate.mockReturnValueOnce({ _id: 1 });
    await likesController.update(req, res, mockPeepModel, mockLikeModel);
    expect(res.json).toHaveBeenCalledWith({
      like: { _id: 1, userId: 1, peepId: 1, username: "foo" },
    });
  });

  it("update doesn't add a like if the peepId and userId already exist", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 1, username: "foo" } },
    };
    const mockPeepModel = { findOneAndUpdate: jest.fn() };
    const mockLikeModel = jest.fn().mockImplementation(() => {
      throw new Error("MongoServerError");
    });
    await likesController.update(req, res, mockPeepModel, mockLikeModel);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("destroy removes a like from the likes array", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 1 } },
    };
    const mockPeepModel = { findOneAndUpdate: jest.fn() };
    const mockLikeModel = { findOneAndDelete: jest.fn() };
    mockLikeModel.findOneAndDelete.mockReturnValueOnce({
      _id: 1,
      peepId: 1,
      userId: 1,
      username: "foo",
    });
    await likesController.destroy(req, res, mockPeepModel, mockLikeModel);
    expect(res.sendStatus).toBeCalledWith(204);
  });
});
