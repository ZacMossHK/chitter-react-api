const mongoose = require("mongoose");
const supertest = require("supertest-session");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Peep = require("../models/peep");

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

  it("DELETE /session will return status 204 if user is logged out", async () => {
    const password = await bcrypt.hash("bar", 10);
    await new User({
      username: "foo",
      email: "email@example.com",
      password: password,
    }).save();
    const session = supertest(app);
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    await session.delete("/session").expect(204);
  });

  it("GET /peeps will return 200 status and peeps in reverse chronolocial order", async () => {
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
    const result = await supertest(app).get("/peeps");
    expect(result.status).toBe(200);
    expect(result.body[0].body).toBe("this should be first");
    expect(result.body[1].body).toBe("this should be in the middle");
    expect(result.body[2].body).toBe("this should be last");
  });

  it("GET /peeps will return 200 status and limit peeps to 50", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    for (let i = 0; i < 100; i++) {
      await new Peep({
        userId: mockUserId,
        body: "foo",
        createdAt: new Date(2022, 10, 11),
      }).save();
    }
    const result = await supertest(app).get("/peeps");
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(50);
  });

  it("GET /peeps/:peepId will return 200 status and an individual peep", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const peep = await new Peep({
      userId: mockUserId,
      body: "foo",
      createdAt: new Date(2022, 10, 11),
    }).save();
    const result = await supertest(app).get(`/peeps/${peep._id}`);
    expect(result.status).toBe(200);
    Object.keys(peep).forEach((key) => {
      expect(result.body[key]).toBe(JSON.stringify(peep)[key]);
    });
  });

  it("GET /peeps/:peepId where peepId doesn't exist will return a 404 status", async () => {
    await supertest(app).get("/peeps/4").expect(404);
  });

  it("POST /peeps will create a peep and return 201 status with the created peep object", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const result = await session
      .post("/peeps")
      .send({ peep: { body: "hello world" } });
    expect(result.status).toBe(201);
    expect(result.body.body).toBe("hello world");
    const peeps = await Peep.find();
    expect(peeps.length).toBe(1);
  });

  it("POST /peeps will return a 403 status if trying to create a peep when not logged in", async () => {
    await supertest(app)
      .post("/peeps")
      .send({ peep: { body: "hello world" } })
      .expect(403);
  });

  it("DELETE /peeps/:peepId will return a 204 status and delete the peep", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const peepRequest = await session
      .post("/peeps")
      .send({ peep: { body: "hello world" } });
    await session.delete(`/peeps/${peepRequest.body._id}`).expect(204);
    const result = await Peep.find();
    expect(result.length).toBe(0);
  });

  it("DELETE /peeps/:peepId will return a 404 status if the peep doesn't exist", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    await session.delete("/peeps/1").expect(404);
  });
});
