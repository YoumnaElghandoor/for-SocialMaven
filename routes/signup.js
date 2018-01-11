var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var cassandra=require('cassandra-driver');

var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,res){
  console.log('signup: cassandra connected');
});

router.get('/', function(req, res, next) {
      res.render('signup');
});

//POST METHOD -- to signup
router.post('/',function(req,res){
  console.log('signingggg uppp');
  var id =cassandra.types.uuid();
  var upsertSubscriber='INSERT INTO people.subscribers(id,email,first_name,last_name,posts)VALUES(?,?,?,?,?)';
  client.execute(upsertSubscriber,[id,req.body.email,req.body.first_name,req.body.last_name,set],
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
  )}
);
module.exports = router;
