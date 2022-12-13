var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users");
/* GET users listing. */
router.get("/test", usersController.test);
router.post("/", usersController.create);

module.exports = router;
