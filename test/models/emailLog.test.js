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
    });
    expect(emailLog.peepId).toBe(mockPeepId);
    expect(emailLog.userId).toBe(mockUserId);
    expect(emailLog.createdAt).toEqual(new Date(2022, 10, 20));
    expect(emailLog.successful).toBe(true);
  });
});
