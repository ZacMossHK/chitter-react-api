exports.index = async (req, res, peepsModel) => {
  const peeps = await peepsModel.find().sort({ createdAt: -1 }).limit(50);
  res.json(peeps);
};
