const mongoose = require("mongoose");
const supertest = require("supertest-session");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Peep = require("../models/peep");
const Like = require("../models/like");
const EmailLog = require("../models/emailLog");
const sgMail = require("@sendgrid/mail");
jest.mock("@sendgrid/mail");

describe("App", () => {
  beforeEach((done) => {
    sgMail.send.mockReset();
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

  it("returns status 404 if a page doesn't exist", async () => {
    await supertest(app).get("/foo").expect(404);
    await supertest(app).post("/bar").expect(404);
  });

  it("returns status 403 if cookie user_sid doesn't match session.id", async () => {
    await supertest(app)
      .delete("/session")
      .set("Cookie", ["user_sid=s=13l4j.1lkj34"])
      .expect(403);
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

  it("POST /users returns status 400 and an obj if username contains invalid characters", async () => {
    const result = await supertest(app)
      .post("/users")
      .send({
        user: {
          username: "%%%^&&&foo",
          email: "email@example.com",
          password: "bar",
        },
      });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({ invalidCharsUsername: true });
  });

  it("POST /users returns status 400 and an obj if email contains invalid characters", async () => {
    const result = await supertest(app)
      .post("/users")
      .send({
        user: {
          username: "foo",
          email: "ema%%%%%il@e^^^^mail.com",
          password: "bar",
        },
      });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({ invalidCharsEmail: true });
  });

  it("POST /users returns status 400 and an obj if username and email contains invalid characters", async () => {
    const result = await supertest(app)
      .post("/users")
      .send({
        user: {
          username: "%%%^&&&foo",
          email: "ema%%%%%il@e^^^^mail.com",
          password: "bar",
        },
      });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      invalidCharsUsername: true,
      invalidCharsEmail: true,
    });
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

  it("DELETE /session will return status 403 if user is not logged in", async () => {
    await supertest(app).delete("/session").expect(403);
  });

  it("DELETE /session will remove the user_sid cookie", async () => {
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
    await session.delete("/session").expect(403);
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

  it("DELETE /peeps/:peepId will return a 403 status if the logged in user doesn't have permission to delete the peep", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const peep = await new Peep({
      userId: mockUserId,
      body: "foobar",
      createdAt: new Date(2022, 10, 13),
    }).save();
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    await session.delete(`/peeps/${peep._id}`).expect(403);
  });

  it("DELETE /peeps/:peepId will return a 403 status if the user is not logged in", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const peep = await new Peep({
      userId: mockUserId,
      body: "foobar",
      createdAt: new Date(2022, 10, 13),
    }).save();
    await supertest(app).delete(`/peeps/${peep._id}`).expect(403);
  });

  it("PUT /peeps/:peepId/likes will return a 201 status and create a like and add it to the peep's likes array", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    await session.post("/peeps").send({ peep: { body: "hello world" } });
    const peep = await Peep.find();
    const result = await session.put(`/peeps/${peep[0]._id}/likes`);
    expect(result.status).toBe(201);
    const like = await Like.find();
    Object.keys(result.body).forEach((key) =>
      expect(result.body[key].toString()).toBe(like[0][key].toString())
    );
    const resultPeeps = await Peep.find();
    expect(resultPeeps[0].likes[0].toString()).toBe(like[0]._id.toString());
  });

  it("PUT /peeps/:peepId/likes will return a 404 status if the peep isn't found", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    await session.post("/peeps").send({ peep: { body: "hello world" } });
    await session.put("/peeps/1/likes").expect(404);
  });

  it("PUT /peeps/peepId/likes will return a 403 status if trying to make a Like that already exists", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const peepResponse = await session
      .post("/peeps")
      .send({ peep: { body: "hello world" } });
    await session.put(`/peeps/${peepResponse.body._id}/likes`).expect(201);
    await session.put(`/peeps/${peepResponse.body._id}/likes`).expect(403);
  });

  it("PUT /peeps/:peepId/likes will return a 403 status if a user isn't logged in", async () => {
    await supertest(app).put("/peeps/1/likes").expect(403);
  });

  it("DELETE /peeps/:peepId/likes will return a 204 status if a like is successfully deleted", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const peepResponse = await session
      .post("/peeps")
      .send({ peep: { body: "hello world" } });
    await session.put(`/peeps/${peepResponse.body._id}/likes`);
    await session.delete(`/peeps/${peepResponse.body._id}/likes`).expect(204);
    const likes = await Like.find();
    expect(likes.length).toBe(0);
    const peep = await Peep.findOne({ _id: peepResponse.body._id });
    expect(peep.likes.length).toBe(0);
  });

  it("DELETE /peeps/:peepId/likes will return a 404 status if a like doesn't exist", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const peepResponse = await session
      .post("/peeps")
      .send({ peep: { body: "hello world" } });
    await session.delete(`/peeps/${peepResponse.body._id}/likes`).expect(404);
  });

  it("DELETE /peeps/:peepId/likes will return a 404 status if a peep doesn't exist", async () => {
    const session = supertest(app);
    await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    await session.post("/peeps").send({ peep: { body: "hello world" } });
    await session.delete(`/peeps/1/likes`).expect(404);
  });

  it("DELETE /peeps/:peepId/likes will return a 403 status if a user isn't logged in", async () => {
    await supertest(app).delete(`/peeps/1/likes`).expect(403);
  });

  // twilio

  it("POST /peeps will create a successful EmailLog entry if an email is successfully sent", async () => {
    sgMail.send.mockImplementation();
    const session = supertest(app);
    const userResponse = await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const peepResponse = await session
      .post("/peeps")
      .send({ peep: { body: "hello @foo!" } });
    const emailLogs = await EmailLog.find();
    console.log(emailLogs);
    expect(emailLogs[0].userId.toString()).toBe(userResponse.body._id);
    expect(emailLogs[0].peepId.toString()).toBe(peepResponse.body._id);
    expect(emailLogs[0].createdAt).toBeTruthy();
    expect(emailLogs[0].successful).toBe(true);
    expect(emailLogs[0].errorMessage).toBeNull();
  });

  it("POST /peeps will create an unsuccessful EmailLog entry if an email is unsuccessfully sent", async () => {
    sgMail.send.mockImplementation(() => {
      throw new Error("TwilioError");
    });
    const session = supertest(app);
    const userResponse = await session.post("/users").send({
      user: { username: "foo", email: "email@email.com", password: "bar" },
    });
    await session
      .post("/session")
      .send({ session: { username: "foo", password: "bar" } });
    const peepResponse = await session
      .post("/peeps")
      .send({ peep: { body: "hello @foo!" } });
    const emailLogs = await EmailLog.find();
    console.log(emailLogs);
    expect(emailLogs[0].userId.toString()).toBe(userResponse.body._id);
    expect(emailLogs[0].peepId.toString()).toBe(peepResponse.body._id);
    expect(emailLogs[0].createdAt).toBeTruthy();
    expect(emailLogs[0].successful).toBe(false);
    expect(emailLogs[0].errorMessage).toBe("Error: TwilioError");
  });
});
