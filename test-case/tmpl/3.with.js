// let obj = {name:'ahhh',age:'11',number:7};

//在with作用域里，变量名可以从obj的属性上取值
// with(obj){
//   console.log('hello'+name+'age'+age);
//   for(let i=0;i<number;++i){
//     console.log(i);
//   }
// }

let str = `
<%if(user){%>
  hello <%=user.name%>
<%}else{%>
  hello guest
<%}%>
`;

(function(){
  let tpl = ``;
  with(options){
    if(user){
      tpl += `hello <%=user.name%>`
    }else{
      tpl += `hi man`
    }
  }
  return tpl;
})

let obj = {user:{name:'ahhh'}};
let script = `
let tpl = \`\`;
with(obj){
  if(user){
    tpl += \`hello <%=user.name%>\`
  }else{
    tpl += \`hi man\`
  }
}
return tpl;
`;
let fn = new Function('obj',script);
let result = fn(obj);
console.log(result);