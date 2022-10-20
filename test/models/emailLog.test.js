const EmailLog = require("../../models/emailLog");
require("../mongodb_helper");
const mongoose = require("mongoose");

let mockUserId, mockPeepId;

describe("Like model", () => {
  beforeEach(async () => {
    mockUserId = new mongoose.Types.ObjectId();
    mockPeepId = new mongoose.Types.ObjectId();
    await EmailLog.deleteMany();
  });

  it("constructs", () => {
    const emailLog = new EmailLog({
      peepId: mockPeepId,
      userId: mockUserId,
      createdAt: new Date(2022, 10, 20),
      successful: true,
      errorMessage: null,
    });
    expect(emailLog.peepId).toBe(mockPeepId);
    expect(emailLog.userId).toBe(mockUserId);
    expect(emailLog.createdAt).toEqual(new Date(2022, 10, 20));
    expect(emailLog.successful).toBe(true);
  });

  it("saves", async () => {
    const emailLog = await new EmailLog({
      peepId: mockPeepId,
      userId: mockUserId,
      createdAt: new Date(2022, 10, 20),
      successful: true,
      errorMessage: null,
    }).save();
    expect(emailLog.peepId).toBe(mockPeepId);
    expect(emailLog.userId).toBe(mockUserId);
    expect(emailLog.createdAt).toEqual(new Date(2022, 10, 20));
    expect(emailLog.successful).toBe(true);
  });

  it("can return all entries", async () => {
    const result = await EmailLog.find();
    expect(result).toEqual([]);
  });

  it("can't save two entries with the same peepId and userId", async () => {
    expect.assertions(1);
    await new EmailLog({
      peepId: mockPeepId,
      userId: mockUserId,
      createdAt: new Date(2022, 10, 20),
      successful: true,
      errorMessage: null,
    }).save();
    try {
      await new EmailLog({
        peepId: mockPeepId,
        userId: mockUserId,
        createdAt: new Date(2022, 10, 20),
        successful: true,
        errorMessage: null,
      }).save();
    } catch (result) {
      expect(result.toString()).toMatch(/MongoServerError/);
    }
  });
});
