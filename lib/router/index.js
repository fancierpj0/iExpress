let http = require('http');
const Route = require('./route.js');
const Layer = require('./layer.js');
const slice = Array.prototype.slice;
const url = require('url');

function Router(){
  function router(req,res,next){
    router.handle(req,res,next);
  }
  Object.setPrototypeOf(router,proto);
  router.stack = [];
  router.paramCallbacks = [];
  return router;
}

let proto = Object.create(null);

proto.route = function(path,middle){
  // console.log(path,middle);
  let route = new Route(path)
    ,layer = new Layer(path,route.dispatch.bind(route));
  if(!middle){
    // console.log(1);
    layer.route = route;
  }else{
    // console.log(2);
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
  let handlers,router;
  if(typeof(path)!=='string'){ //说明第一个参数也是回调 或则是 router
    handlers = slice.call(arguments); //必须放在前面，应为arguments只是对arg的引用，下面修改path会修改到源数据，故先要在上面就拷贝一份
    path = '/';
    if(arguments[0].stack) router = arguments[0];
  }else{ //传了path
    handlers = slice.call(arguments,1);
    if(arguments[1].stack) router = arguments[1];
  }

  if(router){
   let layer = new Layer(path,router);
   this.stack.push(layer);
  }else{
    let route = this.route(path,true); //为true时为注册中间件
    route['middle'].apply(route,handlers);
  }
};

proto.param = function(name,handler){
  let self = this;
  self.paramCallbacks[name]=self.paramCallbacks[name]?self.paramCallbacks[name]:[];
  self.paramCallbacks[name].push(handler);
};

proto.patch_path = function(req){
  if(req.url === '/')return; //默认req.url 为/
  if(req.url === '')return req.url = '/';  //如果注入了一个路由容器，当请求路径为默认，即'/'，第一次handle时，这个'/'(req.url)会被剪掉，当第二次递归handle时,req.url为'',那么layer.match('')时，如果路由容器中有一个路径为全路径的中间件('/')就不能匹配上  因为''!='/' So这里需要加上'/'
  if(req.url.endsWith('/'))return req.url = req.url.slice(0,req.url.length-1);
};

proto.handle = function(req,res,done){
  let index = 0,self = this
    ,removed;
  self.patch_path(req);
  let {pathname} = url.parse(req.url,true);

  function next(err){
    if(index>=self.stack.length){
      return done();
    }
    if(removed){
      req.url = removed+req.url;
      removed = '';
    }
    let layer = self.stack[index++];
    // console.log(self.stack);

    if(layer.match(pathname)){
      // console.log(pathname);
      // console.log(layer);
      if(!layer.route){ //说明是中间件 layer.middle 或则是 一个子路由系统(router)
        removed = layer.path; //  /user
        req.url = req.url.slice(removed.length); //  /2 //从这里以后开始获取url会是不准确的，若在回调中用到了req.url需要注意
        if(err){
          layer.handle_error(err,req,res,next);
        }else{
          layer.handle_request(req,res,next);
        }
      } else{ //说明是路由
        if(!err&&layer.route.handle_method(req.method)){ //如果是查找错误处理中间件会跳过
          req.params = layer.params;
          self.process_params(layer,req,res,()=>{
            layer.handle_request(req,res,next);
          });
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

//先处理param回调,处理完成后才会执行路由回调
proto.process_params = function (layer, req, res, out) {
  let keys = layer.keys;
  let self = this;
  //用来处理路径参数
  let paramIndex = 0 /**key索引**/, key/**key对象**/, name/**key的值**/, val, callbacks, callback;
  //调用一次param意味着处理一个路径参数
  function param() {
    if (paramIndex >= keys.length) {
      return out();
    }
    key = keys[paramIndex++];//先取出当前的key
    name = key.name;// uid
    val = layer.params[name];
    callbacks = self.paramCallbacks[name];// 取出等待执行的回调函数数组
    if (!val || !callbacks) {//如果当前的key没有值，或者没有对应的回调就直接处理下一个key
      return param();
    }
    execCallback();
  }
  let callbackIndex = 0;
  function execCallback() {
    callback = callbacks[callbackIndex++];
    if (!callback) {
      return param();//如果此key已经没有回调等待执行，则代表本key处理完毕，该执行一下key
    }
    callback(req, res, execCallback, val, name);
  }
  param();
};

module.exports = Router;