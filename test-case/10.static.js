let express = require('express');
let app = express();
let path = require('path');
let mime = require('mime');
let fs = require('fs');
let url = require('url');

//--- --- ---
//此中间件会拦截客户端的请求，然后去静态文件根目录下面找一下有没有对应的文件，如果有则返回给客户端，如果没有则next
function static(root,options = {}){
  return function(req,res,next){
    let {pathname} = url.parse(req.url,true); // pathname=/index.html
    let file = path.join(root,pathname); //就得到了此文件的绝对路径
    fs.readFile(file,function(err,stat){
      if(err){ //如果没有这个文件，会报错
        next();
      }else{
        let contentType = mime.getType(pathname);
        res.setHeader('Content-Type',contentType);
        fs.createReadStream(file).pipe(res);
      }
    });
  }
}

//--- --- ---

// app.use(express.static(path.join(__dirname,'public')));
app.use(static(path.join(__dirname,'public')));
app.get('/user',function(req,res){
  res.end('user');
});
app.listen(8080);