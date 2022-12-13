var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const session = require("express-session");
require("dotenv").config();

var usersRouter = require("./routes/users");
const sessionRouter = require("./routes/session");
const peepsRouter = require("./routes/peeps");
const testRouter = require("./routes/test");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(cors());
app.use(cors({ credentials: true, origin: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    key: "user_sid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use("/session", sessionRouter);
app.use("/users", usersRouter);
app.use("/peeps", peepsRouter);
app.use("/test", testRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
