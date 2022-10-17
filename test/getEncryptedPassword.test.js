import getEncryptedPassword from "../public/javascripts/getEncryptedPassword";
const bcrypt = require("bcrypt");
jest.mock("bcrypt");
const bcryptHash = bcrypt.hash;

describe("getEncryptedPassword method", () => {
  beforeEach(() => {
    bcryptHash.mockReset();
  });
  it("encrypts the password", async () => {
    bcryptHash.mockResolvedValue("123password");
    const result = await getEncryptedPassword("password");
    expect(result).toBe("123password");
  });
});
