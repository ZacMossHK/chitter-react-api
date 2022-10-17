var express = require("express");
var router = express.Router();
const sessionController = require("../controllers/session");

router.post("/", sessionController.create);

module.exports = router;
