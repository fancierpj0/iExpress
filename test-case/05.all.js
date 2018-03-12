const express = require('../lib/express.js');
let app = express();

app.all('/all',function(req,res,next){
  res.setHeader('Content-Type','text/html;charset=utf-8');
  res.end('只要路径为/all，不论请求方式是何种的请求都能匹配上该条路由');
})
.listen(8080);