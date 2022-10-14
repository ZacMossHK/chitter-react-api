const Like = require("../../models/like");
require("../mongodb_helper");
const mongoose = require("mongoose");

let mockUserId;

describe("Like model", () => {
  beforeEach((done) => {
    mockUserId = new mongoose.Types.ObjectId();
    Like.deleteMany(() => {
      done();
    });
  });

  it("constructs", () => {
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

  it("can save a like", (done) => {
    new Like({
      userId: mockUserId,
      username: "username",
    }).save((err) => {
      expect(err).toBeNull();

      Like.find((err, likes) => {
        expect(err).toBeNull();
        expect(likes[0].userId).toEqual(mockUserId);
        expect(likes[0].username).toBe("username");
        done();
      });
    });
  });
});
