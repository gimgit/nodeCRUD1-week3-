
const bodyParser = require('body-parser');
const express = require('express');
const methodOverride = require('method-override')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

//라우터 연결(콘텐츠수정, 작성)
const usersRouter = require('./routers/users')
app.use('/api', [usersRouter]);
const contentsRouter = require('./routers/contents');
app.use('/contents',[contentsRouter]);
const writeRouter = require('./routers/write');
app.use('/write', [writeRouter])


var db;
MongoClient.connect('mongodb+srv://wedineinhell:spartan@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    db = client.db('hanghae99');

    app.listen(3000, function(){
        console.log('listening on 3000')
    })
});

// 메인페이지 렌더
app.get('/', function(req, res){
    res.render('index.ejs');
});

// 게시물작성 페이지 렌더
app.get('/write', (req, res) => {
  res.render('write.ejs');
});

// 게시판 렌더
app.get('/list', function(req, res){
    db.collection('post').find().sort({date: -1}).toArray(function(err, result){
        res.render('list.ejs', { posts : result});  
    });
});

// 게시물 상세정보 렌더
app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
    res.render('detail.ejs', { data : result});  
  })
})

// 로그인 페이지 렌더
app.get('/login', async(req, res)=>{
    res.render('login.ejs')
})

// 회원가입 페이지 렌더
app.get('/signUp', async(req, res)=>{
    res.render('signUp.ejs')
})


// function getSelf(callback) {
//     $.ajax({
//       type: "GET",
//       url: "/api/users/me",
//       headers: {
//         authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       success: function (response) {
//         callback(response.user);
//       },
//       error: function (xhr, status, error) {
//         if (status == 401) {
//           alert("로그인이 필요합니다.");
//         } else {
//           localStorage.clear();
//           alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
//         }
//         window.location.href = "/";
//       },
//     });
//   }