// 回调函数的方式 callback setTimeout / fs.readFile .... 回调地狱

// promise 只是优化了一下 并没有完全结果
// generator 可以把函数的执行权交出去 * / yield
// async + await 基于 generator 的 语法糖

function* read() {}

let regeneratorRuntime = {
  wrap(iteratorFn) {
    const context = {
      prev: 0,
      next: 0,
      done: false, // 表示迭代器没有完成
    };
    let it = {};
    it.next = function () {
      let value = iteratorFn(context);
      return {
        value,
        done: context.done,
      };
    };
  },
};

function fn() {
  // 核心是switch case

  const wrap = () => {};
}

function co(it) {
  return new Promise((resolve, reject) => {
    // 异步的迭代 只能用递归
    function next(data) {
      let { value, done } = it.next(data);
      if (done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(next, reject);
      }
    }
    next();
  });
}

// async await 就是 generator + co
