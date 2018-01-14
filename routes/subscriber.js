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

var publishingPost1='SELECT * FROM people.subscribers WHERE id=?';
var publishingPost2='UPDATE people.subscribers SET posts= ? WHERE id=?';
var array=[''];
router.post('/:id',ensureAuthenticated,function(req,res){
  var id = req.params.id;
  var post =req.body.post;
   client.execute(publishingPost1,[id],
      function(err,result)
      {
        if(err)
        {
          res.status(404).send({msg:err});
        }
        else
        {

          array=result.rows[0].posts;
         array.push(post);
        }
      }
    );
    client.execute(publishingPost2,[array,id],
       function(err,result)
       {
         if(err)
         {
           res.status(404).send({msg:err});
         }
         else
         {

           res.render('publishPost');
         }
       });
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  else
  {
    console.log("info", "You must be logged in to see this page.");
    res.redirect('/login');
  }

}


module.exports = router;
