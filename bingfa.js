const fs = require("fs");
const path = require("path");

// 发布-订阅模式

// 事件中心

let events = {
  _events: [],
  on(fn) {
    this._events.push(fn);
  },
  emit(data) {
    this._events.forEach((fn) => fn(data));
  },
};

events.on(() => {
  console.log("每次执行调用一次");
});

var arr = [];
events.on((data) => {
  console.log("111", data);
  //   console.log("传入了什么呀" + data);
  arr.push(data);
});

events.on(() => {
  if (arr.length === 2) {
    console.log("执行完毕了讷", arr);
  }
});

fs.readFile("./a.txt", "utf-8", function (err, data) {
  events.emit(data);
});

fs.readFile("./b.txt", "utf8", function (err, data) {
  events.emit(data);
});
