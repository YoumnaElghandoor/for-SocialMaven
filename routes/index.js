var express = require('express');
var router = express.Router();
var cassandra=require('cassandra-driver');
var passport=require('passport');
var Strategy = require('passport-facebook').Strategy;
var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,res){
  console.log('index: cassandra connected');
});
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


var getAllSubscribers='SELECT * FROM people.subscribers';
/* GET home page. */
router.get('/', function(req, res, next) {

  client.execute(getAllSubscribers,[],function(err,result){
    if(err)
    {
      res.status(404).send({msg:err});
    }
    else
    {
      res.render('index', {
        subscribers : result.rows
      });
    }

  })

});

// router.get('/login',
//   function(req, res){
//     res.render('login');
//   });
//
// router.get('/login/facebook',
//   passport.authenticate('facebook'));
//
// router.get('/login/facebook/return',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });
//
// router.get('/subscriber',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.render('/subscriber', { user: req.user });
//   });
module.exports = router;
