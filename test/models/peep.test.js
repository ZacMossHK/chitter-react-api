require("../mongodb_helper");
const Peep = require("../../models/peep");

describe("Peep model", () => {
  beforeEach((done) => {
    Peep.deleteMany(() => {
      done();
    });
  });

  it("constructs", () => {
    const peep = new Peep({
      userId: "",
      body: "hello world",
      createdAt: new Date(2022, 10, 12),
    });

    expect(peep.userId).toBe(undefined);
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
});
