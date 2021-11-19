var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://wedineinhell:spartan@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    db = client.db('hanghae99');
  //   app.listen(3000, function(){
  //     console.log('listening on 3000')
  // })
});

router.post('/add', function(req, res){  //목차로 이동
    db.collection('counter').findOne({name : 'numberOfPost'}, function(err, result){
      console.log(result.totalPost)
      let Cntpost = result.totalPost;

      db.collection('post').insertOne({
        _id : Cntpost +1,
        title : req.body.title, 
        date : req.body.date, 
        writer : req.body.writer, 
        password : req.body.password, 
        contents : req.body.contents
      } , function(err, result){
        console.log('저장완료')

          db.collection('counter').updateOne({name : 'numberOfPost'},{ $inc : {totalPost:1} },function(err, result){})
            if(err){return console.log('err')}

        res.redirect('http://localhost:3000/list');
        });

    });
   
  });


module.exports = router;