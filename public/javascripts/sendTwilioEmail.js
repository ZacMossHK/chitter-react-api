import EmailLog from "../../models/emailLog";
require("dotenv").config();

exports.sendTwilioEmail = async (taggedUser, peep) => {
  let successful = false;
  let errorMessage = null;
  try {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: process.env.SENDGRID_TO_EMAIL, // Change to your recipient
      from: taggedUser.email, // Change to your verified sender
      subject: "You've been tagged in a Peep!",
      text: `This was posted at ${peep.createdAt.toString()}: ${peep.body}`,
    };
    await sgMail.send(msg);
    successful = true;
  } catch (e) {
    errorMessage = e.toString();
  }
  await new EmailLog({
    userId: taggedUser._id,
    peepId: peep._id,
    createdAt: new Date(),
    successful,
    errorMessage,
  }).save();
};
