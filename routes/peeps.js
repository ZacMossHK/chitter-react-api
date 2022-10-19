var express = require("express");
var router = express.Router();
const peepsController = require("../controllers/peeps");
const likesController = require("../controllers/likes");
const authenticateUser = require("../public/javascripts/authenticateUser");

router.get("/", peepsController.index);
router.post("/", authenticateUser, peepsController.create);
router.get("/:peepId", peepsController.show);
router.delete("/:peepId", authenticateUser, peepsController.destroy);
router.put("/:peepId/likes", authenticateUser, likesController.update);
router.delete("/:peepId/likes", authenticateUser, likesController.destroy);

module.exports = router;
