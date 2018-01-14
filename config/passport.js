var configAuth= require('./auth');

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

  var client = new cassandra.Client({contactPoints:['127.0.0.1']});
  client.connect(function(err,res){
    console.log('passport: cassandra connected');
  });

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      var query='SELECT * FROM people.subscribers WHERE facebook.id =?'
      people.subscribers.(  client.execute(query,[profile.id],
          function(err,result)
          {
            if(err)
              return done(err);
            if(query.result.rows[0].length!=0)
            return done(null,query.result.rows[0]);
            else
            {
              function(req,res){
                  console.log('passport success');
                var id =cassandra.types.uuid();
                var upsertSubscriber='INSERT INTO people.subscribers(id,email,first_name,last_name)VALUES(?,?,?,?)';

                client.execute(upsertSubscriber,[id,req.body.email,req.body.first_name,req.body.last_name],
                  function(err,result)
                  {
                    if(err)
                    {
                      res.status(404).send({msg:err});
                    }
                    else
                    {
                      console.log('signed up !');
                      res.redirect('/');
                    }
                  }
                )};

            }
          });
    })
    });
  }
));
