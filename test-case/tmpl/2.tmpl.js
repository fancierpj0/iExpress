let str = `
<%if(user){%>
  hi <%=user.name%>
<%}else{%>
  hi man
<%}%>
`;

let options = {user:{name:'ahhh'},id:1};
let ejs = require('ejs');
function render(str,options){
  return str.replace(/<%=(\w+?)%>/g,function(){
    return options[arguments[1]];
  });
}

let result = render(str,options);

// 在JS中有三种作用域 全局作用域 函数作用域 with作用域