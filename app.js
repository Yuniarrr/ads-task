var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const UserService = require('./services').user;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

passport.use(
  new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
  }, async (jwtPayload, done) => {
    try {
      console.log(jwtPayload);
      const { id } = jwtPayload;
      const isUserExist = await UserService.findUserById(id);
      if (isUserExist) {
        return done(null, jwtPayload);
      }
      return done(null, false);
    } catch (error) {
      console.log("Error");
      console.log(error);
      return done(error, false);
    }
  }));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ error: 'Not found' })
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err);
  res.status(err.status || 500).send({ error: err })
});

module.exports = app;
