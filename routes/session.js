var express = require("express");
var router = express.Router();
const sessionController = require("../controllers/session");
const authenticateUser = require("../public/javascripts/authenticateUser");

router.post("/", sessionController.create);
router.delete("/", authenticateUser, sessionController.destroy);

module.exports = router;
