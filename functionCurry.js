// 函数柯里化 多个参数的传入 把他转化成 n个函数---可以暂存变量
// 一般柯里化参数要求 都是一个个的传 =》 如果不是一个一个传，比如一会传一个，一会传两个，这种函数我们叫做偏函数

// 判断一个变量的类型
// typeof 我们一般用于判断基础类型
// instanceof xxx 是谁的实例
// Object.prototype.toString.call 判断具体类型 返回一个字符串
// contructor 深拷贝

function isType(val, typing) {
  return Object.prototype.toString.call(val) == `[Object ${typing}]`;
}

// 实现通用的柯里化函数：高阶函数

function curring(fn) {
  console.log(fn.length);
  const inner = (args = []) => {
    // 存储每次调用时传入的参数
    return args.length >= fn.length
      ? fn(...args)
      : (...a) => inner([...args, ...a]);
  };
  return inner();
}

function sum(a, b, c, d) {
  // 要记录每次调用传入的函数，并且和函数的参数个数进行比较，如果不满，则返回新函数，如果传入的个数和参数一致，
  // 执行原来的函数
  return a + b + c + d;
}

console.log(isType(true));
