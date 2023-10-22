const PENDING = "pending";
const FULFILLED = "fullfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.reason = undefined;
    this.value = undefined;
    this.onResolveCallbacks = [];
    this.onRejectCallbacks = [];
    const resolve = (value) => {
      if (this.status !== PENDING) {
        return;
      }
      this.status = FULFILLED;
      this.value = value;
      this.onResolveCallbacks.forEach((i) => i());
    };

    const reject = (reason) => {
      if (this.status !== PENDING) {
        return;
      }
      this.status = REJECTED;
      this.reason = reason;
      this.onRejectCallbacks.forEach((i) => i());
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (r) => {
            throw r;
          };

    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
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
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.value);
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

  finaly(cb) {
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
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  let called = false;
  if (promise2 === x) {
    return reject(new TypeError("错误"));
  }

  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        if (called) return;
        called = true;
        then.call(
          x,
          (v) => resolvePromise(promise2, v, resolve, reject),
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
      const element = promises[index];
      if (element.then && typeof element.then === "function") {
        element.then((val) => processSuccess(index, val), reject);
      } else {
        processSuccess(index, element);
      }
    }
  });
};

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const el = promises[i];
      if (el && typeof el.then === "function") {
        el.then(resolve, reject);
      } else {
        resolve(el);
      }
    }
  });
};
