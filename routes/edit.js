var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var cassandra=require('cassandra-driver');

var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,res){
  console.log('Edit: cassandra connected');
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
      res.render('edit',{
        first_name:result.rows[0].first_name,
        posts:result.rows[0].posts
      })
    }
  })
});

// router.post('/',function(req,res){
//
//   var upsertSubscriber='INSERT INTO people.subscribers(id,email,first_name,last_name) VALUES(?,?,?,?)';
//   client.execute(upsertSubscriber,[req.body.id,req.body.email,req.body.first_name,req.body.last_name],
//     function(err,result)
//     {
//       if(err)
//       {
//         res.status(404).send({msg:err});
//       }
//       else
//       {
//         console.log('signed up !');
//         res.redirect('/');
//       }
//     }
//   )}
// );
module.exports = router;
