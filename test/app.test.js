const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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

  it("POST /user creates a user with status 200", async () => {
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

  it("POST /session logs in a user with status 201", async () => {
    const password = await bcrypt.hash("bar", 10);
    const user = await new User({
      username: "foo",
      email: "email@example.com",
      password: password,
    }).save();
    const result = await supertest(app)
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    expect(result.status).toBe(201);
    expect(result.body._id).toBe(user._id.toString());
    expect(result.body.username).toBe("foo");
  });

  it("POST /session will return status 403 if username doesn't exist", async () => {
    await supertest(app)
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } })
      .expect(403);
  });

  it("POST /session will return status 403 if password doesn't match", async () => {
    const password = await bcrypt.hash("bar", 10);
    const user = await new User({
      username: "foo",
      email: "email@example.com",
      password: password,
    }).save();
    await supertest(app)
      .post("/session")
      .send({ session: { username: "foo", password: "barry" } })
      .expect(403);
  });

  it("DELETE /session will return status 204 if user is logged out", () => {});
});
