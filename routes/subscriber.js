var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var cassandra=require('cassandra-driver');

var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,res){
  console.log('subscriber: cassandra connected');
});

var getSubscriberById='SELECT * FROM people.subscribers WHERE id=?'
/* GET users listing. */
router.get('/:id', function(req, res, next) {
  client.execute(getSubscriberById,[req.params.id],function(err,result){
    if(err)
    {
      res.status(404).send({msg:err});
    }
    else
    {
      res.render('subscriber',{
        id:result.rows[0].id,
        email:result.rows[0].email,
        first_name:result.rows[0].first_name,
        last_name:result.rows[0].last_name,
        posts:result.rows[0].posts
      })
    }
  })
});

router.post('/subscriber',function(req,res){

  var upsertSubscriber='UPDATE people.subscribers SET posts=? WHERE id=? AND email=?';
  client.execute(upsertSubscriber,[req.body.posts,req.body.id,req.body.email],
    function(err,result)
    {
      if(err)
      {

        res.status(404).send({msg:err});
      }
      else
      {
        res.redirect('/subscriber');
      }
    }
  )}
);
module.exports = router;
