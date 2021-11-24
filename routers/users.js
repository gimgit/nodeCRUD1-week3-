var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

var db;
MongoClient.connect('mongodb+srv://wedineinhell:spartan@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    db = client.db('hanghae99');
});

router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await db.collection('users').findOne({ nickname });

  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  const token = jwt.sign({ nickname: user.nickname }, 'CSK')
    res.send({
        token,
    })
})


router.post("/signUp", async (req, res, next)=>{
  const nickname = req.body.nickname
  const pw1 = req.body.pw1
  const pw2 = req.body.pw2
  const namingRule = /^[a-zA-z0-9]{3,999}$/
  const existingUser = await db.collection('users').findOne({nickname : nickname});

  // 패스워드 양식 확인
  if (pw1.length < 4 || pw1.includes(nickname) == true){
    res.status(400).send({
      errorMessage: "패스워드는 4자이상, 닉네임을 포함하지 않음"
    })
    return;
  }
  // 패스워드 일치 확인
  if (pw1 !== pw2) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }
  // 닉네임 양식 확인
  if (nickname < 3 || namingRule.test(nickname) == false){
    res.status(400).send({
      eroorMessage: "닉네임은 3자이상, 알파벳 대소문자, 숫자로 구성"
    })
    return;
  }
  // 닉네임 중복 확인
  if (existingUser !== null){
    res.status(400).send({
      errorMessage: "아이디 중복"
    })
    return;
  }
  // 회원가입
  db.collection('users').insertOne({
    nickname : nickname, 
    password : pw1
  } , function(err, result) {

    res.redirect('/login') 
  })
});

router.get("/users/me", authMiddleware, async (req, res) => {
  // res.send({ user: res.locals.user });
  const user = res.locals.user;

  if (user === null) {
    res.status(401).send('로그인이 필요합니다.');
    return;
  }
  res.status(200).send({
    user: {
      nickname: user.nickname,
    },
  });
});

// router.get('/users/me', authMiddleware, async (req, res) => {
//   const user = res.locals.user;

//   if (user === null) {
//     res.status(401).send('로그인이 필요합니다.');
//     return;
//   }
//   res.status(200).send({
//     user: {
//       nickname: user.nickname,
//     },
//   });
// });


// function getSelf(callback) {
//   console.log('hi1')
//     $.ajax({
//         type: "GET",
//         url: "/api/users/me",
//         headers: {
//         authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         success: function (response) {
//         callback(response.user);
//         },
//         error: function (xhr, status, error) {
//         if (status == 401) {
//             alert("로그인이 필요합니다.");
//         } else {
//             localStorage.clear();
//             alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
//         }
//         window.location.href = "/";
//         },
//     });
//     }
  


// function getSelf(callback) {
//   console.log('hi')
//   $.ajax({
//     type: "GET",
//     url: "/me",
//     headers: {
//       authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//     success: function (response) {
//       callback(response.user);
//     },
//     error: function (xhr, status, error) {
//       if (status == 401) {
//         alert("로그인이 필요합니다.");
//       } else {
//         localStorage.clear();
//         alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
//       }
//       window.location.href = "/";
//     },
//   });
// }

module.exports = router;
