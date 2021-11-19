
const bodyParser = require('body-parser');
const express = require('express');
const methodOverride = require('method-override')
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

const contentsRouter = require('./routes/contents');
app.use('/contents',contentsRouter);
const writeRouter = require('./routes/write');
app.use('/write',writeRouter)

var db;
MongoClient.connect('mongodb+srv://wedineinhell:spartan@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    db = client.db('hanghae99');

    app.listen(3000, function(){
        console.log('listening on 3000')
    })
});

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/write', (req, res) => {
  res.render('write.ejs');
});

app.get('/list', function(req, res){
    db.collection('post').find().sort({date: -1}).toArray(function(err, result){
        res.render('list.ejs', { posts : result});  
    });
});

app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
    res.render('detail.ejs', { data : result});  
  })
})
