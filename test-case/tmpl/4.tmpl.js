let str = `
<%if(user){%>
  hi <%=user.name%>
<%}else{%>
  hi man
<%}%>
<ul>
<%for(let i=0;i<length;++i){%>
  <li><%=i%></li>
<%}%>
</ul>
`;

//关键词 with Function 字符串拼接
let options = {user:{name:'ahhh'},id:1,length:9};

function render(str,options,callback){
  let head = "let tpl = ``;\r\nwith(obj){\r\n tpl+=`"; //这里加上tpl是为支持下面完成闭合
  str = str.replace(/<%=([\s\S]+?)%>/g,function(){
    return "${" + arguments[1] + "}";
  });
  str = str.replace(/<%([\s\S]+?)%>/g,function(){
    return "`;\r\n" + arguments[1]+"\r\n;tpl+=`";
  });
  let tail = "`}\nreturn tpl;";
  let html = head + str + tail;
  // console.log(html);
  let fn = new Function('obj',html);
  // return fn(options);
  let result = fn(options);
  callback(null,result);
}

let result = render(str,options);
console.log(result);