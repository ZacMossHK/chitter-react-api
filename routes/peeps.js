var express = require("express");
var router = express.Router();
const peepsController = require("../controllers/peeps");

router.get("/", peepsController.index);

module.exports = router;
