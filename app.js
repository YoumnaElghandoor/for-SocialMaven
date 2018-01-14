var express = require('express');
var passport=require('passport');
var Strategy = require('passport-facebook').Strategy;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cassandra= require('cassandra-driver');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var index = require('./routes/index');
var subscriber = require('./routes/subscriber');
var signup = require('./routes/signup');
var deleting = require('./routes/delete');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/subscriber', subscriber);
app.use('/signup', signup);
app.use('/delete',deleting);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
