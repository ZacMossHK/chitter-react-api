const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

describe("App", () => {
  beforeEach((done) => {
    mongoose.connect(
      "mongodb://0.0.0.0/chitter_test",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done()
    );
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  it("POST /user creates a user", async () => {
    const result = await supertest(app)
      .post("/users")
      .send({
        user: { username: "foo", email: "email@email.com", password: "bar" },
      });
    expect(result.status).toBe(201);
    expect(result.body._id).toBeTruthy();
    expect(result.body.username).toBe("foo");
    return;
  });

  it("POST /user returns status 400 if username alredy exists in db", async () => {
    const userObj = {
      username: "foo",
      email: "email@example.com",
      password: "bar",
    };
    await new User(userObj).save();
    await supertest(app)
      .post("/users")
      .send({
        user: userObj,
      })
      .expect(400);
    return;
  });
});
