import Peep from "../models/peep";

exports.index = async (req, res) => {
  const peeps = await Peep.find().sort({ createdAt: -1 }).limit(50);
  res.json(peeps);
};

exports.show = async (req, res) => {
  const peep = await Peep.findOne({ _id: req.params.peepId });
  res.json(peep);
};

exports.destroy = async (req, res) => {
  const result = await Peep.findOneAndDelete({
    _id: req.params.peepId,
    userId: req.session.user._id,
  });
  const status = !result ? 403 : 204;
  res.sendStatus(status);
};
