import * as likesController from "../../controllers/likes";

let res;
describe("Likes controller", () => {
  beforeEach(() => {
    res = { json: jest.fn() };
  });
  it("update adds a like", async () => {
    const req = {
      params: { peepId: 1 },
    };
    const mockPeepModel = { findOneAndUpdate: jest.fn() };
    const mockLikeModel = jest.fn().mockImplementation(() => {
      return {
        save: jest.fn(() => {
          return {
            _id: 1,
            userId: 1,
            username: "foo",
          };
        }),
      };
    });
    mockPeepModel.findOneAndUpdate.mockReturnValueOnce({ _id: 1 });
    await likesController.update(req, res, mockPeepModel, mockLikeModel);
    expect(res.json).toHaveBeenCalledWith({
      user: { userId: 1, username: "foo" },
    });
  });
});
