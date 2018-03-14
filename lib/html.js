const fs = require('fs');
function render(filepath,data,callback){
  fs.readFile(filepath,'utf8',function(err,str){
    if(err) return callback(err,null);

    let head = "let tpl = ``;\r\nwith(obj){\r\n tpl+=`";
    str = str.replace(/<%=([\s\S]+?)%>/g,function(){
      return "${" + arguments[1] + "}";
    });
    str = str.replace(/<%([\s\S]+?)%>/g,function(){
      return "`;\r\n" + arguments[1]+"\r\n;tpl+=`";
    });
    let tail = "`}\r\nreturn tpl;";
    let html = head + str + tail;
    let fn = new Function('obj',html);
    let result = fn(data);
    callback(null,result);
  });
}
module.exports = render;