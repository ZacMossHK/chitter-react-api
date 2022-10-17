exports.update = async (req, res, peepModel, likeModel) => {
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
};
