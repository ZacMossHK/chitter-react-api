var express = require("express");
var router = express.Router();
const sessionController = require("../controllers/session");
/* GET home page. */
router.get("/", sessionController.index);

module.exports = router;
