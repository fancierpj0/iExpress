function pathToRegexp(path,keys=[]){
  if(path.includes(':')){ // /:name/:id
    path = path.replace(/:([^\/]+)/g,function(){ //:name,name
      keys.push({
        name:arguments[1]
        ,optional:false
        ,offset:arguments[2]
      });
      return '(:?[^\/]+)';
    });
    path += '[\\/]?$';
    console.log(path)
    return new RegExp(path); // --> /\/user\/([^/]+)\/([^/]+)/
  }
}

let r1 = '/account/:name/:id';
let reg = pathToRegexp(r1);
// console.log(reg.test('/account/ahhh/1/')); //true
let res = reg.exec('/account/ahhh/1/');
console.log(res);
for(let i=0;i<res.length;++i){
  console.log(res[i]);
}


// let str = '\\s'; //若是用new RegExp生成 必须用\\
// console.log(str);
// let reg = new RegExp(str);
// console.log(reg.test('1')); //false

// let str = '\/';
// console.log('\/');
// let reg = new RegExp(str);
// console.log(reg.test('/123'));

// console.log('123/'.match(/[^/]+/));
// console.log(/[/]+/.test('123')); //false
// console.log(/[\/]+/.test('12/3')); //true
// console.log(/[/]+/.test('12/3')); //true

// console.log('/'); // /
// console.log('\/'); // /

// console.log(/\//.test('/123'));