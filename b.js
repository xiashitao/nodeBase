const fs = require("fs");
const path = require("path");
const vm = require("vm");

function Module(id) {
  this.id = id;
  this.exports = {};
}

Module._resolveFilename = function (id) {
  let filePath = path.resolve(__dirname, id);
  const isExist = fs.existsSync(filePath);

  if (isExist) {
    return filePath;
  }

  let keys = Reflect.ownKeys(Module._extensions);
  for (let index = 0; index < keys.length; index++) {
    const element = keys[index];
    let newPath = filePath + element;
    if (fs.existsSync(newPath)) return newPath;
  }
  throw new Error("can not found");
};

Module.prototype.load = function () {
  const extName = path.extname(this.id);
  Module._extensions[extName](this);
};

Module._cache = {};

Module._extensions = {
  ".js"(module) {
    const script = fs.readFileSync(module.id, "utf-8");
    const templateFn = `(function(exports,module,require,__dirname,__filename){
        ${script}})`;
    const fn = vm.runInThisContext(templateFn);
    const exports = module.exports;
    const thisValue = exports;
    const filename = module.id;
    let dirname = path.dirname(filename);
    fn.call(thisValue, exports, req, dirname, filename);
  },
  ".json"(module) {
    const script = fs.readFileSync(module.id, "utf-8");
    module.exports = JSON.parse(script);
  },
  node() {},
};

function req(filename) {
  filename = Module._resolveFilename(filename); // 1. 创造一个绝对引用地址，方便后续读取
  const cacheModule = Module._cache[filename];
  if (cacheModule) return cacheModule;
  const module = new Module(filename); // 2. 根据路径创造一个模块
  Module._cache[filename] = module;
  module.load();
  return module.exports;
}

let a = req("./a");
console.log(a);
