// const express= require('express');
const express = require('../lib/express');
const path = require('path');
const html = require('../lib/html');
const app = express();
const fs = require('fs');

//views是用来设置模板存放根目录
app.set('views',path.resolve('views')); //source-tml

//如果render没有指定模板后缀名，会以这个作为后缀名
app.set('view engine','html');

//用来设置模板引擎，遇到html结尾模板用什么模板渲染引擎来渲染
//require('ejs')._express   render(filepath,options,callback)
// app.engine('html',html); //sourceのext
app.engine('.html',require('ejs').__express);

app.use(function(req,res,next){
  res.render = function(name,data){
    console.log('---');
    let ext = '.'+app.get('view engine');
    name = name.indexOf('.')!=-1?name:name+ext;
    let filepath = path.join(app.get('views'),name);
    let render = app.engines[ext];
    function done(err,ret){
      if(err)return console.log('发生未知错误，模板渲染出错');
      res.setHeader('Content-Type','text/html');
      res.end(ret);
    }
    render(filepath,data,done);
  };
  next();
});

app.get('/',function(req,res,next){
  //render第一个参数是模板的相对路径 第二个参数是数据对象
  res.render('index',{title:'hello',user:{name:'ahhh'}});
});

app.listen(8080);