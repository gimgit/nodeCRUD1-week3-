var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://wedineinhell:spartan@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    db = client.db('hanghae99');
});

//  게시물 작성페이지에서 db로 저장, 
//  패스워드 해싱 등을 통한 보안 강화 가능함
//  작성날짜가 부정확, 작성 시간을 추가하는 등 개선이 필요함.
router.post('/add', function(req, res){
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
        console.log(result)
        // 게시물 번호를 카운트하는 db
          db.collection('counter').updateOne({name : 'numberOfPost'},{ $inc : {totalPost:1} },function(err, result){})
            if(err){return console.log('err')}

        res.redirect('/kyung.shop/list');
        });

    });
   
  });


module.exports = router;