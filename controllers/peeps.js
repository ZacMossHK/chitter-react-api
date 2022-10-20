import Peep from "../models/peep";
import User from "../models/user";
import { sendTwilioEmail } from "../public/javascripts/sendTwilioEmail";

exports.index = async (req, res) => {
  const peeps = await Peep.find().sort({ createdAt: -1 }).limit(50);
  res.json(peeps);
};

exports.show = async (req, res) => {
  try {
    const peep = await Peep.findOne({ _id: req.params.peepId });
    res.json(peep);
  } catch {
    res.sendStatus(404);
  }
};

exports.create = async (req, res) => {
  const peep = await new Peep({
    userId: req.session.user._id,
    body: req.body.peep.body,
    createdAt: Date.now(),
    likes: [],
  }).save();
  const splitBody = req.body.peep.body.split(" ");
  for (let i = 0; i < splitBody.length; i++) {
    if (splitBody[i][0] === "@") {
      try {
        const username = splitBody[i]
          .slice(1)
          .replace(/[^a-zA-Z0-9]/g, " ")
          .split(" ")[0];
        const taggedUser = await User.findOne({
          username: username,
        });
        console.log("hello");
        await sendTwilioEmail(taggedUser);
      } catch {}
    }
  }
  return res.status(201).json(peep);
};

exports.destroy = async (req, res) => {
  let status;
  try {
    const result = await Peep.findOneAndDelete({
      _id: req.params.peepId,
      userId: req.session.user._id,
    });
    status = !result ? 403 : 204;
  } catch {
    status = 404;
  }
  res.sendStatus(status);
};
