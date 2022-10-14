const Like = require("../../models/like");
require("../mongodb_helper");
const mongoose = require("mongoose");

describe("Like model", () => {
  beforeEach((done) => {
    Like.deleteMany(() => {
      done();
    });
  });

  it("constructs", () => {
    const mockUserId = new mongoose.Types.ObjectId();

    const like = new Like({
      userId: mockUserId,
      username: "username",
    });

    expect(like.userId).toEqual(mockUserId);
    expect(like.username).toEqual("username");
  });

  it("can list all likes", (done) => {
    Like.find((err, likes) => {
      expect(err).toBeNull();
      expect(likes).toEqual([]);
      done();
    });
  });
});
