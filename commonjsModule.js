// 为什么要有模块化
// 1. 为了解决命名冲突问题 （单例模式不能完全解决这些问题)
// umd 兼容 amd 和 cmd + commonjs 不支持es6模块

// commonjs 规范 （基于文件读写 如果依赖了某个文件我会进行文件读取） 动态的
// esm 规范 （每次引用一个模块 发请求） 静态的
// es6 “静态”模块可以做（tree-shaking） commonjs动态模块可以在代码执行的时候引入模块（无法做tree-shaking）

// 模块规范
// 1. 每个文件都是一个模块 （每个模块外面都有一个函数）
// 2. 文件需要被别人使用 需要导出 module.exports = xxx
// 3. 如果需要使用别人 那就需要require语法

// 模块的分类 1. 核心模块 、内置模块（node中自带的模块 fs http vm）
// 2. 第三方模块 （使用别人的模块需要安装co）
// 3. 文件模块 别人引用的时候需要通过相对路径或者绝对路径来引用

// fs path vm模块
const fs = require("fs");

// 读取文件需要判断是否存在

let res = fs.readFileSync("./a.txt", "utf-8", (err, data) => {});
console.log(res);

const path = require("path");
console.log(path.resolve(__dirname, "a", "b", "v"));
console.log(process.cwd());
console.log(path.extname("a.min.js"));

eval("console.log(1)");

// 字符串如何能变成js来执行？
// eval 会受环境影响
// new Function 模版引擎的实现原理 不会受环境影响，可以获取全局变量，还是会有污染的情况
// node 中自己实现了一个模块vm 不受影响（沙箱环境） 快照（执行前记录信息，执行后还原信息）

const vm = require("vm");
global.a = 100;
global.b = 20;
vm.runInThisContext("console.log(a)"); // 在node中全局变量是在多个模块下共享的，所以不要通过global来定义属性
vm.runInNewContext("console.log(b)"); // 无法获取global中b的值，因为创建了一个全新的上下文

// require的实现，1.读取文件 2.读取到后给文件包装一个函数 3.通过runInThisContext 将它变成js语法 4. 调用
