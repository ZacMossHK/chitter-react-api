exports.index = async (req, res, peepsModel) => {
  const peeps = await peepsModel.find().sort({ createdAt: -1 }).limit(50);
  res.json(peeps);
};

exports.show = async (req, res, peepsModel) => {
  const peep = await peepsModel.findOne({ _id: req.params.peepId });
  res.json(peep);
};

exports.destroy = async (req, res, peepsModel) => {
  const result = await peepsModel.findOneAndDelete({
    _id: req.params.peepId,
    userId: req.session.user._id,
  });
  const status = result.toString().includes("CastError") ? 403 : 204;
  res.sendStatus(status);
};
