import * as peepsController from "../../controllers/peeps";
import { index } from "../../controllers/session";

let res;
describe("Peeps controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
  });
  it("gets the latest 50 peeps", () => {
    const peepsModel = { find: jest.fn() };
    peepsController.index({}, res);
    expect();
  });
});
