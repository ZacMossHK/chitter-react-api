exports.index = async (req, res, peepsModel) => {
  const peeps = await peepsModel.find().sort({ createdAt: -1 }).limit(50);
  res.json(peeps);
};

exports.show = async (req, res, peepsModel) => {
  const peep = await peepsModel.findOne({ _id: req.params._id });
  res.json(peep);
};

exports.destroy = async (req, res, peepsModel) => {
  await peepsModel.findOneAndDelete({
    _id: req.params._id,
    userId: req.session.user._id,
  });
  res.sendStatus(204);
};
