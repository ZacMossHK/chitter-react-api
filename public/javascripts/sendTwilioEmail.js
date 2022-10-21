import EmailLog from "../../models/emailLog";
import * as sgMail from "@sendgrid/mail";
require("dotenv").config();

exports.sendTwilioEmail = async (taggedUser, peep) => {
  let errorMessage = null;
  try {
    await connectToTwilio(taggedUser, peep);
  } catch (e) {
    errorMessage = e.toString();
  }
  await createEmailLog(taggedUser, peep, errorMessage);
};

const createEmailLog = async (taggedUser, peep, errorMessage) => {
  await new EmailLog({
    userId: taggedUser._id,
    peepId: peep._id,
    createdAt: new Date(),
    successful: !errorMessage,
    errorMessage,
  }).save();
};

const connectToTwilio = async (taggedUser, peep) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.SENDGRID_TO_EMAIL, // Change to your recipient
    from: taggedUser.email, // Change to your verified sender
    subject: "You've been tagged in a Peep!",
    text: `This was posted at ${peep.createdAt.toString()}: ${peep.body}`,
  };
  await sgMail.send(msg);
};
