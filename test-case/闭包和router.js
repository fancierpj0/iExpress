function a(){
  let t = 0;
  function b(){
    t = t+1;
    console.log(t);
  }
  return b;
}

// 因为返回的b并没有被什么占用
// 每次返回的b都处在一个全新a空间内
a()(); //1
a()(); //1

// 当返回的b被占用 就会形成闭包
let c = a();
c(); //1
c(); //2