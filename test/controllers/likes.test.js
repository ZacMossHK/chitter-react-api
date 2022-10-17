import * as likesController from "../../controllers/likes";

let res;
describe("Likes controller", () => {
  beforeEach(() => {
    res = { sendStatus: jest.fn() };
  });
  it("update adds a like", () => {
    const req = {
      params: { peepId: 1 },
    };
    // peepsModel.
  });
});
