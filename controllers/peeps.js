const Peep = require("../models/peep");
const User = require("../models/user");
const sendTwilioEmail = require("../public/javascripts/sendTwilioEmail");

exports.index = async (req, res) => {
  const peeps = await Peep.find().sort({ createdAt: -1 }).limit(50);
  return res.json(peeps);
};

exports.show = async (req, res) => {
  try {
    const peep = await Peep.findOne({ _id: req.params.peepId });
    return res.json(peep);
  } catch {
    return res.sendStatus(404);
  }
};

exports.create = async (req, res) => {
  const peep = await new Peep({
    userId: req.session.user._id,
    body: req.body.peep.body,
    createdAt: new Date(),
  }).save();
  const splitBody = req.body.peep.body.split(" ");
  for (let i = 0; i < splitBody.length; i++)
    if (splitBody[i][0] === "@") await emailTaggedUser(splitBody, i, peep);
  return res.status(201).json(peep);
};

const emailTaggedUser = async (splitBody, i, peep) => {
  try {
    const username = splitBody[i]
      .slice(1)
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")[0];
    const taggedUser = await User.findOne({ username });
    await sendTwilioEmail(taggedUser, peep);
  } catch {}
};

exports.destroy = async (req, res) => {
  let status = 404;
  try {
    const result = await Peep.findOneAndDelete({
      _id: req.params.peepId,
      userId: req.session.user._id,
    });
    status = !result ? 403 : 204;
  } catch {}
  return res.sendStatus(status);
};
