// 1. 核心模块、内置模块 node中自带的
// 2. 文件模块 引用都是相对路径
// 文件模块的查找规范：最新：默认查找先查找同名文件，如果没找到尝试查找.js 和 .json 文件
// 如果再没有就查找同名文件夹（当成一个包），先查找package.json 如果没有就找index.js 如果还没有就报错了

// 3.第三方模块（安装的包都有描述信息，否则无法上传） （引用也是没有相对路径 1. 全局模块 2. 代码中的第三方模块）
// 默认会沿着当前目录向上查找，如果没有找到再向上查找 ，查找上级的node_modules 如果找到根路径还没有找到就报错了

console.log(module.paths);
const r = require("co");
console.log(r); // 如果文件夹中有package.json 文件，则优先查找package.json 中指定的main 文件，如果main字段的文件找不到 则报错
// 如果没有package.json 文件 则找index.js

// 1. 包的安装 1）全局模块 -》 安装到电脑的npm下
// 3n 模块 npm nrm（node registry manager）nvm(node version manager)
// 全局安装只能在命令行中使用，自己实现一个全局包 1. 需要配置bin命令 2. 添加执行方式 #! /usr/bin/env node
// 3. 将此包放在npm下（可以全局安装） 临时做一个npm link （参考global-module 文件夹）

// npm 5.2 之后会把共同的模块拍平
// .bin 模块意味着你安装的一些模块可以在命令行中执行
// 如果直接用 npm run script 的方式 默认在执行命令之前，会将环境变量添加到全局下
// 所以可以使用，但是命令执行完毕后会删掉对应的path

// npx和npm run 类似， npx 如果 模块不存在会先安装 再使用，使用后可以自动删除掉
