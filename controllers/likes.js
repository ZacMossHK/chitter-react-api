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
    return res.status(201).json(like);
  } catch (e) {
    const errorStatus = e.toString().includes("MongoServerError") ? 403 : 404;
    return res.sendStatus(errorStatus);
  }
};

exports.destroy = async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({
      peepId: req.params.peepId,
      userId: req.session.user._id,
    });
    await Peep.findOneAndUpdate(
      { _id: req.params.peepId },
      { $pull: { likes: like._id } }
    );
    res.sendStatus(204);
  } catch {
    res.sendStatus(404);
  }
};
