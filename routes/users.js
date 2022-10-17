var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users");
/* GET users listing. */
router.post("/", usersController.create);

module.exports = router;
