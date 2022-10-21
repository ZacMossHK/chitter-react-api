import { sendTwilioEmail } from "../public/javascripts/sendTwilioEmail";
import EmailLog from "../models/emailLog";
import * as sgMail from "@sendgrid/mail";
jest.mock("../models/emailLog");
jest.mock("@sendgrid/mail");

describe("sendTwilioEmail method", () => {
  beforeEach(() => {
    EmailLog.mockReset();
    sgMail.send.mockReset();
  });

  it("sends a tagged user an email and makes a log in the EmailLog collection", async () => {
    const taggedUser = { _id: 1, email: "email@email.com", username: "foo" };
    const peep = {
      _id: 1,
      body: "body @foo",
      createdAt: new Date(2022, 10, 20),
    };
    sgMail.send.mockResolvedValue();
    await sendTwilioEmail(taggedUser, peep);
    const sendMsg = sgMail.send.mock.calls[0][0];
    expect(sendMsg.from).toBe(taggedUser.email);
    expect(sendMsg.subject).toBe("You've been tagged in a Peep!");
    expect(sendMsg.text).toBe(
      `This was posted at ${peep.createdAt.toString()}: ${peep.body}`
    );
    const emailLogCall = EmailLog.mock.calls[0][0];
    expect(emailLogCall.peepId).toBe(1);
    expect(emailLogCall.userId).toBe(1);
    expect(emailLogCall.successful).toBe(true);
  });

  it("fails to send an email to a user if there is an issue with the email service", async () => {
    const taggedUser = { _id: 1, email: "email@email.com", username: "foo" };
    const peep = {
      _id: 1,
      body: "body @foo",
      createdAt: new Date(2022, 10, 20),
    };
    sgMail.send.mockImplementation(() => {
      throw new Error("TwilioError");
    });
    await sendTwilioEmail(taggedUser, peep);
    const emailLogCall = EmailLog.mock.calls[0][0];
    expect(emailLogCall.peepId).toBe(1);
    expect(emailLogCall.userId).toBe(1);
    expect(emailLogCall.successful).toBe(false);
    expect(emailLogCall.errorMessage).toBe("Error: TwilioError");
  });
});
