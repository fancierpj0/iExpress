const http = require('http')
const url = require('url');

http.createServer(function(req,res){
  console.log(req.url); //http://localhost:8080/user?a=1  -> /user?a=1
  ///http://localhost:8080  仍然会输出 /
  let {pathname} = url.parse(req.url);
  res.end(pathname); // /
}).listen(8080);