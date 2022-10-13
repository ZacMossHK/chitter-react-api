require("../mongodb_helper");
const Peep = require("../../models/peep");
const User = require("../../models/user");
const mongoose = require("mongoose");

describe("Model integration", () => {
  beforeEach((done) => {
    User.deleteMany(() => {
      Peep.deleteMany(() => {
        done();
      });
    });
  });

  it("can link a peeps user Id to a user", (done) => {
    const user = new User({
      username: "username",
      email: "email@email.com",
      password: "password",
      peeps: [],
    });
    let createdUserId;

    user.save((err) => {
      expect(err).toBeNull();

      User.find((err, users) => {
        expect(err).toBeNull();
        createdUserId = users[0]._id;

        new Peep({
          userId: users[0]._id,
          body: "hello world",
          createdAt: new Date(2022, 10, 12),
        }).save((err) => {
          expect(err).toBeNull();

          Peep.find((err, peeps) => {
            expect(err).toBeNull();
            expect(peeps[0].userId).toEqual(createdUserId);

            User.findOne({ _id: peeps[0].userId }, (err, user) => {
              expect(err).toBeNull();
              expect(user.username).toBe("username");
              done();
            });
          });
        });
      });
    });
  });

  it("can link to a peep from the peeps array", (done) => {
    let peepId;
    new Peep({
      userId: new mongoose.Types.ObjectId(),
      body: "hello world",
      createdAt: new Date(2022, 10, 12),
    }).save((err, peep) => {
      expect(err).toBeNull();
      peepId = peep._id;
      new User({
        username: "username",
        email: "email@email.com",
        password: "password",
        peeps: [peep._id],
      }).save((err, user) => {
        expect(err).toBeNull();
        User.findOne({ _id: user._id })
          .populate("peeps")
          .exec((err, populatedUser) => {
            expect(err).toBeNull();
            expect(populatedUser.peeps[0].body).toBe("hello world");
            done();
          });
      });
    });
  });
});
