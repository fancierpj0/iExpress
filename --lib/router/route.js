let http = require('http');
let Layer = require('./layer.js');
let slice = Array.prototype.slice;

function Route(path){
  this.path = path;
  this.methods = {};
  this.stack = [];
}

http.METHODS.forEach(function(METHOD){
  let method = METHOD.toLowerCase();
  Route.prototype[method] = function(){
    let handlers = slice.call(arguments);
    this.methods[method] = true;

    for(let i=0;i<handlers.length;++i){
      let layer = new Layer('/',handlers[i]);
      layer.method = method;
      this.stack.push(layer);

    }
    return this;
  }
});

Route.prototype.handle_method = function(method){
  return this.methods[method.toLowerCase()]?true:false;
};

Route.prototype.dispatch = function(req,res,out){
  let self = this
    ,index = 0;
  // let q = 0
  function next(err){
    if(err){
      return out(err); //出现错误，退出当前路由交给错误中间件处理
    }

    if(index>=self.stack.length){
      return out(); //当前路由的layer已经遍历完 跳出 继续匹配下一条路由
    }

    let layer = self.stack[index++];

    if(layer.method === req.method.toLowerCase()){
      layer.handle_request(req,res,next);
    }else{
      next(err);
    }
  }
  next();
};

module.exports = Route;