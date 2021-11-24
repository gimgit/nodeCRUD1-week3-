const MongoClient = require('mongodb').MongoClient;
const jwt = require("jsonwebtoken");

var user;
MongoClient.connect('mongodb+srv://wedineinhell:spartan@cluster0.wljzs.mongodb.net/hanghae99?retryWrites=true&w=majority',  
    {useUnifiedTopology: true }, function(err, client){
    if(err) {return console.log('err')}

    user = client.db('hanghae99');
});

// module.exports = (req, res, next) => {
//   console.log('미들웨어')
//   const { authorization } = req.headers
//   console.log(authorization)
//   const [tokenType, tokenValue] = (authorization || "").split(" ");
//   console.log(tokenType)
//   console.log(tokenValue)

//   if (tokenType !== 'Bearer') {
//     res.status(401).send('로그인 후 사용하세요.');
//     return;
//   }
//   if (tokenValue === 'null') {
//     // 예외처리이렇게 안하면 밑에 401로안가고, 이름모를 401으로 뜨는 이유가 뭘까
//     res.locals.user = null;
//     next();
//     return;
//   }
//   try {
//     const { nickname } = jwt.verify(tokenValue, 'CSK');
//     User.findOne({ nickname: nickname }).then((user) => {
//       // 여기서 findone안하면 res.locals값이상해져서 안나옴
//       res.locals.user = user;
//       console.log('로그인 성공 또는 인증 성공');
//       next();
//     });
//   } catch (error) {
//     res.status(401).send('로그인 후 사용하세요.');
//     return;
//   }
// };
    module.exports = (req, res, next) => {
      console.log('미들웨어')
      const { authorization } = req.headers
      console.log(authorization)
      const [authType, authToken] = (authorization || "").split(" ");
      console.log(authType)
      console.log(authToken)
    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }

  try {
    const { nickname } = jwt.verify(authToken, "CSK");
    user.findOne({nickname: nickname}).then((user) => {
      res.locals.user = user;
      console.log('성공')
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};

  // const [authType, authToken] = (authorization || "").split(" ");
  // if (!authToken) {
  //   res.status(401).send({
  //     errorMessage: "토큰 없음 로그인 후 이용 가능한 기능입니다.",
  //   });
  //   return;
  // }

  // if (authType !== "Bearer") {
  //   res.status(401).send({
  //     errorMessage: "로그인 후 이용 가능한 기능입니다.",
  //   });
  //   return;
  // }

  // try {
  //   const { nickname } = jwt.verify(authToken, "CSK");
  //   user.findById(nickname).then((user) => {
  //     res.locals.user = user;
  //     next();
  //   });
  // } catch (err) {
  //   res.status(401).send({
  //     errorMessage: "로그인 후 이용 가능한 기능입니다2.",
  //   });
  // }
// };