exports.update = async (req, res, peepModel, likeModel) => {
  try {
    const like = await new likeModel({
      userId: req.session.user._id,
      peepId: req.params.peepId,
      username: req.session.user.username,
    }).save();
    await peepModel.findOneAndUpdate(
      { _id: req.params.peepId },
      { $push: { likes: like._id } }
    );
    res.json({ like: like });
  } catch {
    res.sendStatus(403);
  }
};

exports.destroy = async (req, res, peepModel, likeModel) => {
  const like = await likeModel.findOneAndDelete({
    peepId: req.params.peepId,
    userId: req.session.user._id,
  });
  await peepModel.findOneAndUpdate(
    { _id: req.params.peepId },
    { $pull: { likes: like._id } }
  );
  res.sendStatus(204);
};
