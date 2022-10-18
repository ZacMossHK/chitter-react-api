var express = require("express");
var router = express.Router();
const peepsController = require("../controllers/peeps");
const authenticateUser = require("../public/javascripts/authenticateUser");

router.get("/", peepsController.index);
router.post("/", authenticateUser, peepsController.create);
router.get("/:peepId", peepsController.show);

module.exports = router;
