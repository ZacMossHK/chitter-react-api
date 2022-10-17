exports.update = (req, res, peepModel, likeModel) => {
  const like = new likeModel({userId: req.session.user._id, username: })
};
