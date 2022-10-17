import Like from "../models/like";
import Peep from "../models/peep";

exports.update = async (req, res) => {
  try {
    const like = await new Like({
      userId: req.session.user._id,
      peepId: req.params.peepId,
      username: req.session.user.username,
    }).save();
    await Peep.findOneAndUpdate(
      { _id: req.params.peepId },
      { $push: { likes: like._id } }
    );
    res.json({ like: like });
  } catch {
    res.sendStatus(403);
  }
};

exports.destroy = async (req, res) => {
  const like = await Like.findOneAndDelete({
    peepId: req.params.peepId,
    userId: req.session.user._id,
  });
  await Peep.findOneAndUpdate(
    { _id: req.params.peepId },
    { $pull: { likes: like._id } }
  );
  res.sendStatus(204);
};
