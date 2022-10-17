exports.index = async (req, res, peepsModel) => {
  const peeps = await peepsModel.find().sort({ createdAt: -1 }).limit(50);
  res.json(peeps);
};

exports.getSinglePeep = async (req, res, peepsModel) => {
  const peep = await peepsModel.findOne({ _id: req.params._id });
  res.json(peep);
};
