var express = require("express");
var router = express.Router();
const peepsController = require("../controllers/peeps");

router.get("/", peepsController.index);
router.get("/:peepId", peepsController.show);

module.exports = router;
