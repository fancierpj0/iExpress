const express = require('../lib/express.js');
const app = express();

app
  .route('/hello')
  .get(function(req,res,next){
    res.end('helloget');
  })
  .post(function(req,res,next){
    res.end('hellopost');
  })
  // .listen(8080) //错误的
app.listen(8080); //注意不能和其它方法连用