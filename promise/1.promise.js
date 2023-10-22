// 1. promise 是一个类，无需考虑兼容性
// 2. 当使用promise的时候，会传入一个执行器，此执行器是立即执行
// 3. 当前excutor 给了两个函数可以来描述当前promise的状态，promise有三个状态 成功态，失败态，等待态
// 默认是等待态 如果调用resolve会走到成功态，如果调用reject 或者发生异常 会走失败态
// 4. 每个promise实例都有一个then方法
// 5. promise 一旦状态变化后不能更改

// promise 还是基于回调的

// 1.promise的链式调用 当调用then方法后会返回一个新的promise
// 情况1: then中方法返回的是一个（普通值 不是promise）的情况，会作为外层下一次then的成功结果
// 情况2: then中方法 执行出错 会走到外层下一次then的失败结果
// 无论上一次then走是成功还是失败，只要返回的是普通值 都会执行下一次then的成功

const PENDING = "PENDING";
const FULFULLED = "FULFULLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.reason = undefined;
    this.value = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status !== PENDING) {
        return;
      }
      this.status = FULFULLED;
      this.value = value;
      this.onResolvedCallbacks.forEach((fn) => fn());
    };

    const reject = (reason) => {
      if (this.status !== PENDING) {
        return;
      }
      this.status = FULFULLED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  catch(errorFn) {
    return this.then(null, errorFn);
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (v) => {
            throw v;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFULLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);

            // 此x 可能是一个promise，如果是
            // promise需要看一下这个promise是成功还是失败
            // .then ，如果成功则把成功的结果 调用promise2 的 resolve传递进去，如果失败则同理

            //   resolve(x);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
}

// 利用x的值来调用promise2的resolve还是reject
function resolvePromise(promise2, x, resolve, reject) {
  // 核心流程
  let called = false;
  if (promise2 === x) {
    // resolve(1);
    return reject(new TypeError("错误"));
  }

  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      // 有可能then是通过defineProperty 实现的
      let then = x.then;
      if (typeof then === "function") {
        if (called) return;
        called = true;
        then.call(
          x,
          (y) => resolvePromise(promise2, y, resolve, reject),
          (r) => {
            reject(r);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let result = [];
    let times = 0;
    const processSuccess = (index, val) => {
      result[index] = val;
      if (++times === promises.length) {
        resolve(result);
      }
    };

    for (let index = 0; index < promises.length; index++) {
      const p = promises[index];
      if (p.then && typeof p.then === "function") {
        p.then((val) => processSuccess(index, val), reject);
      } else {
        processSuccess(index, p);
      }
    }
  });
};

Promise.prototype.finaly = function (cb) {
  //promise结束就结束了
  return this.then(
    (data) => {
      return Promise.resolve(cb()).then(() => data);
    },
    (reason) => {
      return Promise.resolve(cb()).then((n) => {
        throw reason;
      });
    }
  );
};

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < promises.length; index++) {
      const element = promises[index];
      if (element && typeof element.then === "function") {
        element.then(resolve, reject);
      } else {
        resolve(element);
      }
    }
  });
};

function promisify(fn) {
  return function (...arg) {
    return new Promise((resove, reject) => {
      fn(...arg, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}

function promisifyAll(obj) {
  let o = {};
  for (let i in obj) {
    if (typeof obj[i] === "function") {
      o[key + "Promise"] = promisify(obj[key]);
    }
  }
  return o;
}

module.exports = Promise;
