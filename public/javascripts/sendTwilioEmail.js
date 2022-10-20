require("dotenv").config();

exports.sendTwilioEmail = async () => {
  try {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: process.env.SENDGRID_TO_EMAIL, // Change to your recipient
      from: process.env.SENDGRID_FROM_EMAIL, // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    await sgMail.send(msg);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
