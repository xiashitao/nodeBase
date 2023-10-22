const Promise = require("./1.promise");
Promise.resolve(20).then((va) => console.log(va));
const promise = new Promise((resolve, reject) => {
  console.log("promise");
  setTimeout(() => {
    resolve("kaishi");
  }, 1000);
});

// promise
//   .then(
//     (value) => {
//       throw new Error();
//       console.log("success", value);
//     },
//     (reason) => {
//       console.log("err", reason);
//     }
//   )
//   .then(
//     (value) => {
//       console.log("进value");
//     },
//     (reason) => {
//       console.log("进reason了");
//     }
//   );

new Promise((resolve) => {
  resolve(222);
})
  .then((data) => {
    // console.log(data);
    // return "x";
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("kkk000");
      }, 1000);
    });
  })
  .then((data) => {
    console.log("dataX", data);
  });

console.log("ok");
