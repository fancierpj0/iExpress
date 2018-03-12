let http = require('http');
let Layer = require('./layer.js');
let slice = Array.prototype.slice;

function Route(path){
  this.path = path;
  this.methods = {};
  this.stack = [];
}

http.METHODS.push('all');
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

//支持多cb中间
Route.prototype.middle = function(){
  let handlers = slice.call(arguments);
  this.methods['middle'] = true;

  for(let i=0;i<handlers.length;++i){
    let layer = new Layer('/',handlers[i]);
    layer.method = 'middle';
    this.stack.push(layer);
  }
  return this;
};

Route.prototype.handle_method = function(method){ //快速匹配
  return (this.methods[method.toLowerCase()]||this.methods['all'])?true:false;
};

Route.prototype.dispatch = function(req,res,out){
  let self = this
    ,index = 0
    ,args;

  if(arguments.length==4){ //因为分发时可能是这样调用的 layer.handle_error(err,req,res,next) 参数就错位了 需要进行容错
    args = slice.call(arguments);
    req = args[1];
    res = args[2];
    out = args[3];
    next(args[0]);
  }else{
    next();
  }

  function next(err){
    if(err&&!self.methods['middle']){
      return out(err); //出现错误，并且是路由，退出当前路由交给错误中间件处理
    }

    if(index>=self.stack.length){
      return out(err); //当前路由的layer已经遍历完 跳出 继续匹配下一条路由
    }

    let layer = self.stack[index++];

    if((layer.method === req.method.toLowerCase())||layer.method === 'all'){
      layer.handle_request(req,res,next);
    }else if(layer.method==='middle'){
      if(err){
        layer.handle_error(err,req,res,next);
      }else{
        layer.handle_request(req,res,next);
      }
    }else{
      next(err);
    }

  }//next结束

};

module.exports = Route;