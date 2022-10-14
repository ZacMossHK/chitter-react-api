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
});
