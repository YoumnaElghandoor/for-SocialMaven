var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var cassandra=require('cassandra-driver');

var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,res){
  console.log('Delete: cassandra connected');
});

// var getSubscriberById='SELECT * FROM people.subscribers WHERE id=?'
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   client.execute(getSubscriberById,[],function(err,result){
//     if(err)
//     {
//       res.status(404).send({msg:err});
//     }
//     else
//     {
//       res.render('edit',{
//         first_name:result.rows[0].first_name,
//         posts:result.rows[0].posts
//       })
//     }
//   })
// });
var query='SELECT * FROM people.subscribers WHERE id=?';
var query2='DELETE posts[?] FROM people.subscribers WHERE id=?';
var array=[''];
var idx = '0';
router.get('/:id/:post',ensureAuthenticated,function(req,res,update){
   var post =req.params.post;
   var id =req.params.id;

   client.execute(query,[id],
      function(err,result)
      {
        if(err)
        {
          res.status(404).send({msg:err});
        }
        else
        {

          array=result.rows[0].posts;
          idx=array.indexOf(post);
        }
      }
    );
    client.execute(query2,[idx,id],{hints:['int','uuid']},
       function(err,result)
       {
         if(err)
         {
           res.status(404).send({msg:err});
         }
         else
         {
           res.render('delete');
         }
       }
     );

});


    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      else
      {
        console.log("info", "You must be logged in to see this page.");
        res.redirect('/login');
      }

    }

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
