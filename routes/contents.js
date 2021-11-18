var express = require('express');
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb+srv://hshsnamu:058402cool@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    db = client.db('hanghae99');
});

    router.get('/edit/:id', function(req, res){
    
        db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
    
        // console.log(result);
        res.render('edit.ejs', { post : result})
        })
    })
  
    router.put('/edit', editAuth, function(req, res){
        db.collection('post').updateOne({_id : parseInt(req.body.id) },{$set : { title :req.body.title, writer : req.body.writer, contents : req.body.contents }}, function(err, result){
        console.log('수정완료')
        res.redirect('/list')
        })
    
    })
    

      function editAuth(req,res,next){
        // db.collection('post').findOne({_id: parseInt(req.params.id)}), function(err, result){
            // let standardDb = db.collection('post').findOne({"_id": 22 })
            db.collection('post').findOne({_id: parseInt(req.body.id) }, function(err, result){
                let dbPw = result.password;
                let editPw = req.body.password;
                console.log(dbPw);
                console.log(editPw);
                if (editPw == dbPw){
                    next();
                }else{
                    console.log('비밀번호확인')
                }    
            })
        }

        router.delete('/delete', function(req, res){
            req.body._id = parseInt(req.body._id);
            db.collection('post').deleteOne(req.body, function(err, result){
                
                
                console.log('삭제완료');
                res.status(200).send('성공');
            })
        })

module.exports = router;