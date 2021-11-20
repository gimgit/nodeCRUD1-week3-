
const bodyParser = require('body-parser');
const express = require('express');
const methodOverride = require('method-override')
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

//라우터 연결(콘텐츠수정, 작성)
const contentsRouter = require('./routes/contents');
app.use('/contents',contentsRouter);
const writeRouter = require('./routes/write');
app.use('/write',writeRouter)

// 몽고 디비 연결(atlas)
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
