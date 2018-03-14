let str = `hello <%=name%> world <%=age%>`;
let options = {name:'ahhh',age:11};
let ejs = require('ejs');
function render(str,options){
  return str.replace(/<%=(\w+?)%>/g,function(){
    return options[arguments[1]];
  })
}
let result = render(str,options);
console.log(result);