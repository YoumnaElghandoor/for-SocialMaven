var express = require('express');
var router = express.Router();
var cassandra=require('cassandra-driver');
var passport=require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var client = new cassandra.Client({contactPoints:['127.0.0.1']});

client.connect(function(err,res){
  console.log('index: cassandra connected');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
  var array=[''];
 var insert = "INSERT INTO people.subscribers (id,first_name,posts) VALUES (?,?,?)";
  var dbInsert = function(profile) {
     client.execute(insert, [profile.id, profile.displayName,array], function (err, result) {
 	console.log(err);
 	console.log('login successfully: ' + profile.displayName);
     });
 };

passport.use(new FacebookStrategy({
  clientID:'357481568060786',
  clientSecret:'ae6f64972c71e01523e8a4af406c8aa6',
  callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log('facebook strategy');
      console.log(profile); // print names
       dbInsert(profile);
      return done(null, profile);
    });
  }
));

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
router.use(function(req, res, next) {
  res.locals.currentUser = req.user;

  next();
});

exports.fb_auth = function(req, res, next){
passport.authenticate('facebook')(req, res, next);
return;
};

router.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

exports.fb_callback = function(req, res, next){
passport.authenticate('facebook', { successRedirect: '/',
  failureRedirect: '/login' })(req, res, next);
};



router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('facebook callback');
    res.redirect('/');
  });


  router.get('/login', function(req, res){
    res.render('login');
  });

  router.get('/logout', function(req, res){
    console.log("logged out");
    req.logout();
    res.redirect('/');
  });

// router.post('/',function(req,res){
//   console.log('subscriber publishing posts');
//   console.log(req);
//   var upsertSubscriber='UPDATE people.subscribers SET posts='+req.body.posts+'? WHERE id=309e8450-f870-11e7-b8e7-a598cc2e2625?VALUES(?,?)';
//   client.execute(upsertSubscriber,[req.params.id,req.body.post],
//     function(err,result)
//     {
//       if(err)
//       {
//
//         res.status(404).send({msg:err});
//       }
//       else
//       {
//         res.redirect('/');
//       }
//     }
//   )}
// );
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
