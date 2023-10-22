// 默认执行文件，使用node来执行，他会把这个文件当成一个模块 默认把this给改了

console.log(global);

// 在前端中访问变量是通过window属性 但是在后端中 想访问全局需要通过global

// Buffer node 中的二进制对象

console.log(__dirname);
console.log(__filename);
console.log(process.platform);
process.chdir("../");
console.log(process.cwd());

// nextTick 优先级比promise要更高

Promise.resolve().then(() => {
  console.log("promise");
});

process.nextTick(() => [console.log("nextTick")]);

// poll 阶段
// 1. 检测 poll 队列中是否为空，如果不为空则执行队列中的任务，直到超时或者全部执行完毕
// 2. 执行完毕后检测setImmediate 队列是否为空，如果不为空则执行check阶段 如果为空则等待时间到达，时间到达后会到timer阶段
// 3. 等待时间到达时可能会出现新的callback 此时也在当前阶段被清空
