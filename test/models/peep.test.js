require("../mongodb_helper");
const Peep = require("../../models/peep");
const mongoose = require("mongoose");

describe("Peep model", () => {
  beforeEach((done) => {
    Peep.deleteMany(() => {
      done();
    });
  });

  it("constructs", () => {
    const mockObjectId = new mongoose.Types.ObjectId();

    const peep = new Peep({
      userId: mockObjectId,
      body: "hello world",
      createdAt: new Date(2022, 10, 12),
      likes: [],
    });

    expect(peep.userId).toEqual(mockObjectId);
    expect(peep.body).toBe("hello world");
    expect(peep.createdAt).toEqual(new Date(2022, 10, 12));
  });

  it("can list all peeps", (done) => {
    Peep.find((err, peeps) => {
      expect(err).toBeNull();
      expect(peeps).toEqual([]);
      done();
    });
  });

  it("can save a peep", (done) => {
    const mockObjectId = new mongoose.Types.ObjectId();

    const peep = new Peep({
      userId: mockObjectId,
      body: "hello world",
      createdAt: new Date(2022, 10, 12),
      likes: [],
    });

    peep.save((err) => {
      expect(err).toBeNull();

      Peep.find((err, peeps) => {
        expect(err).toBeNull();
        expect(peeps[0].userId).toEqual(mockObjectId);
        expect(peeps[0].body).toBe("hello world");
        expect(peeps[0].createdAt).toEqual(new Date(2022, 10, 12));
        done();
      });
    });
  });

  it("can call multiple peeps in reverse chronological order", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    await new Peep({
      userId: mockUserId,
      body: "this should be last",
      createdAt: new Date(2022, 10, 11),
    }).save();

    await new Peep({
      userId: mockUserId,
      body: "this should be first",
      createdAt: new Date(2022, 10, 13),
    }).save();

    await new Peep({
      userId: mockUserId,
      body: "this should be in the middle",
      createdAt: new Date(2022, 10, 12),
    }).save();

    const users = await Peep.find().sort({ createdAt: -1 });
    expect(users[0].body).toBe("this should be first");
    expect(users[1].body).toBe("this should be in the middle");
    expect(users[2].body).toBe("this should be last");
  });
});
