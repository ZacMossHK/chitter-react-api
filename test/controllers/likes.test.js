import * as likesController from "../../controllers/likes";
import Like from "../../models/like";
import Peep from "../../models/peep";
jest.mock("../../models/like");
jest.mock("../../models/peep");

let res;

describe("Likes controller", () => {
  beforeEach(() => {
    res = { json: jest.fn(), sendStatus: jest.fn() };
    Like.mockReset();
    Peep.mockReset();
  });
  it("update adds a like", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 1, username: "foo" } },
    };
    Like.mockImplementation(() => {
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
    Peep.findOneAndUpdate.mockReturnValueOnce({ _id: 1 });
    await likesController.update(req, res);
    expect(res.json).toHaveBeenCalledWith({
      like: { _id: 1, userId: 1, peepId: 1, username: "foo" },
    });
  });

  it("update doesn't add a like if the peepId and userId already exist", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 1, username: "foo" } },
    };
    Like.mockImplementation(() => {
      throw new Error("MongoServerError");
    });
    await likesController.update(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("destroy removes a like from the likes array", async () => {
    const req = {
      params: { peepId: 1 },
      session: { user: { _id: 1 } },
    };
    Like.findOneAndDelete.mockReturnValueOnce({
      _id: 1,
      peepId: 1,
      userId: 1,
      username: "foo",
    });
    await likesController.destroy(req, res);
    expect(res.sendStatus).toBeCalledWith(204);
  });
});
