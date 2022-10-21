const Like = require("../models/like");
const Peep = require("../models/peep");

exports.update = async (req, res) => {
  try {
    return await createLike(req, res);
  } catch (e) {
    const errorStatus = e.toString().includes("MongoServerError") ? 403 : 404;
    return res.sendStatus(errorStatus);
  }
};

const createLike = async (req, res) => {
  const like = await new Like({
    userId: req.session.user._id,
    peepId: req.params.peepId,
    username: req.session.user.username,
  }).save();
  await Peep.findOneAndUpdate(
    { _id: req.params.peepId },
    { $push: { likes: like._id } }
  );
  return res.status(201).json(like);
};

exports.destroy = async (req, res) => {
  try {
    return await destroyLike(req, res);
  } catch {
    return res.sendStatus(404);
  }
};

const destroyLike = async (req, res) => {
  const like = await Like.findOneAndDelete({
    peepId: req.params.peepId,
    userId: req.session.user._id,
  });
  await Peep.findOneAndUpdate(
    { _id: req.params.peepId },
    { $pull: { likes: like._id } }
  );
  return res.sendStatus(204);
};
