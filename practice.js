function curring(fn) {
  const inner = (arg = []) => {
    return arg.length >= fn.length
      ? fn(...arg)
      : (...a) => inner([...arg, ...a]);
  };
  return inner();
}

function sum(a, b, c, d) {
  return a + b + c + d;
}

const a = curring(sum);
const b = a(1, 2);
const c = b(3);
const d = c(4);
// const e = d(4);

console.log(d);

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 1000);
}).finally(() => {
  return;
});
