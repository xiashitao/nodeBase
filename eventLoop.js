// 事件环
// js是单线程（主线程）
// 1. js代码执行的时候遇到函数会创建执行上下文栈

// 2. 当我们执行上下文栈都执行完毕后，等会可能api执行完成或者时间到达

// 3. 不停扫描队列，将队列中的任务拿出来放到上下文栈中执行
// 事件循环线程专门干这件事，检测当前执行栈是否为空，如果为空，从事件队列中取出一个来执行 setTimeout 宏任务

// 4. 当代码执行时还会有一些任务 promise 为例，微任务，每次执行宏任务的时候，都会单独创建一个微任务队列 先进先出

// 5. 微任务在执行完毕后，浏览器会检测是否要重新渲染，浏览器有刷新频率 大约16.6ms

// 6. 每次循环一次都会执行一个宏任务，并清空对应的微任务队列，每次循环完毕后，都要看是否要渲染，如果需要渲染才渲染

// 宏任务script脚本，界面渲染也是宏任务 setTimeout setInterval postMessage MessageChannel setImediate 也是宏任务