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

proto.route = function(path){
  let route = new Route(path)
    ,layer = new Layer(path,route.dispatch.bind(route));
  layer.route = route;
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

proto.handle = function(req,res,done){
  let index = 0,self = this
    ,removed
    ,{pathname} = url.parse(req.url,true);

  for(let i=0;i<self.stack.length;++i){
    if(i>=self.stack.length){
      return done();
    }
    let layer = self.stack[i];
    if(layer.match(pathname)){
      if(!layer.route){

      }else{

        if(layer.route&&layer.route.handle_method(req.method)){
          // let flag = layer.handle_request(req,res);

          for(let j=0;j<layer.route.stack.length;++j){
            let handleLayer = layer.route.stack[j];
            if(handleLayer.method === req.method.toLowerCase()){
              handleLayer.handle_request(req,res);
              if(handleLayer.stop){
                return;
              }
            }
          }//遍历handleLayer

        }//快速匹配成功

      }//说明是路由

    }//匹配路径
  }
  // function next(err){
  //   if(index>=self.stack.length){
  //     return done();
  //   }
  //   if(removed){
  //     req.url = removed+req.url;
  //     removed = '';
  //   }
  //   let layer = self.stack[index++];
  //
  //   if(layer.match(pathname)){
  //     if(!layer.route){
  //
  //     } else{
  //       if(layer.route&&layer.route.handle_method(req.method)){
  //         layer.handle_request(req,res,next);
  //       }else{
  //         next(err);
  //       }
  //     }
  //   }else{
  //     next(err);
  //   }
  // }

  // next();
};

module.exports = Router;