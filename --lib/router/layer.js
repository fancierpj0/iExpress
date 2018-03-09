function Layer(path,handler){
  this.path = path;
  this.handler = handler;
}

Layer.prototype.match = function(path){
  return path === this.path?true:false;
};

Layer.prototype.handle_request = function(req,res,next){
  this.handler(req,res,next);
  console.log(this.stop);
  // if(this.handler.length==3){
  //   return true;
  // }else{
  //   return false;
  // }
};

Layer.prototype.handle_error = function(err,req,res,next){
  if(this.handler.length !=4){
    return next(err);
  }
  this.handler(err,req,res,next);
};

module.exports = Layer;