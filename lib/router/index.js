let http = require('http');
const Route = require('./route.js');
const Layer = require('./layer.js');
const slice = Array.prototype.slice;
const url = require('url');

function Router(){
  function router(){
    router.handle(req,res,next);
  }
  Object.setPrototypeOf(router,proto);
  router.stack = [];
  router.paramCallbacks = [];
  return router;
}

let proto = Object.create(null);

proto.route = function(path,middle){
  let route = new Route(path)
    ,layer = new Layer(path,route.dispatch.bind(route));
  if(!middle){
    layer.route = route;
  }else{
    layer.middle = route;
  }
  this.stack.push(layer);

  return route;
};

http.METHODS.forEach(function(METHOD){
  let method = METHOD.toLowerCase();
  proto[method] = function(path){
    let route = this.route(path); //注册路由层
    route[method].apply(route,slice.call(arguments,1)); //注册路由层的层
  }
});

proto.use = function(path){
  let handlers;
  if(typeof(path)!='string'){ //说明参数全是回调
    handlers = slice.call(arguments); //必须放在前面，应为arguments只是对arg的引用，下面修改path会修改到源数据，故先要在上面就拷贝一份
    path = '/';
  }else{
    handlers = slice.call(arguments,1);
  }

  let route = this.route(path,true); //为true时为注册中间件
  route['middle'].apply(route,handlers);
};

proto.handle = function(req,res,done){
  let index = 0,self = this
    ,removed
    ,{pathname} = url.parse(req.url,true);

  function next(err){
    if(index>=self.stack.length){
      return done();
    }
    if(removed){
      req.url = removed+req.url;
      removed = '';
    }
    let layer = self.stack[index++];

    if(layer.match(pathname)){
      if(!layer.route){ //说明是中间件 layer.middle
        if(err){
          layer.handle_error(err,req,res,next);
        }else{
          layer.handle_request(req,res,next);
        }
      } else{ //说明是路由
        if(!err&&layer.route.handle_method(req.method)){ //如果是查找错误处理中间件会跳过
          layer.handle_request(req,res,next);
        }else{
          next(err);
        }
      }
    }else{
      next(err);
    }
  }//next结束

  next();
};

module.exports = Router;