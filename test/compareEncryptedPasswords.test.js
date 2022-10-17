import compareEncryptedPasswords from "../public/javascripts/compareEncryptedPasswords";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
jest.mock("bcrypt");
const bcryptCompare = bcrypt.compare;

describe("getEncryptedPassword method", () => {
  beforeEach(() => {
    bcryptCompare.mockReset();
  });
  it("compares two passwords and returns true if they match", async () => {
    bcryptCompare.mockResolvedValue(true);
    const result = await compareEncryptedPasswords("password", "123password");
    expect(result).toBe(true);
  });
});
