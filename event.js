const EventEmitter = require("events");
const utils = require("util");

// 继承实例属性

function Girl() {}
utils.inherits(Girl, EventEmitter);

let girl = new Girl();

girl.on("女士失恋", (a, b) => {
  console.log("哭");
});

girl.on("女士失恋", (a, b) => {
  console.log("吃");
});

setTimeout(() => {
  girl.emit("女士失恋", "a", "b");
});

// Girl.prototype.__proto__ = EventEmitter.prototype;
// Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype);

// function create(proto) {
//   function Fn() {}
//   Fn.prototype = proto;
//   return new Fn();
// }
// Girl.prototype = Object.create(EventEmitter.prototype);
//es6 extends
