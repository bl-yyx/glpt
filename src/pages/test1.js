// console.log('script start');

// setTimeout(() => {
//     console.log('setTimeout1');
//     Promise.resolve().then(() => {
//       console.log('timeoutMicro');
//     })
//   }, 0);

//   Promise.resolve()
//     .finally(() => {
//       console.log('promise finally');
//     })
//     .then(() => {
//       console.log('promise1');
//     })
//     .then(() => {
//         console.log('promise2');
//       });

//   async function fn() {
//     console.log('async before await');
//     await Promise.resolve();
//     console.log('async after await');
//   }
//   fn();

//   console.log('script end');

//   async before await
//     script end
// promise finally
// async after await
//     promise1
// promise2
//     setTimeout1
//     timeoutMicro

// TODO1:手写promise
// class MyPromise {
//     constructor(executor) {
//       this.state = "pending";
//       this.value = undefined;
//       this.onResolve = [];
//       this.onReject = [];

//       const resolve = (v) => {
//         if (this.state !== "pending") return;
//         this.state = "fulfilled";
//         this.value = v;
//         // this.onResolve.forEach(fn => setTimeout(() => fn(v)));
//         this.onResolve.forEach(fn => fn(v));
//       };
//       const reject = (e) => {
//         if (this.state !== "pending") return;
//         this.state = "rejected";
//         this.value = e;
//         // this.onReject.forEach(fn => setTimeout(() => fn(e)));
//         this.onReject.forEach(fn => fn(e));
//       };

//       try { executor(resolve, reject); }
//       catch (err) { reject(err); }
//     }

//     then(success, fail) {
//       success = success || (v => v);
//       fail = fail || (e => { throw e; });
//       return new MyPromise((res, rej) => {
//         // pending 状态，存入队列，加try-catch
//         if (this.state === "pending") {
//           this.onResolve.push(() => {
//             try {
//                  res(success(this.value));
//                 }
//             catch (err) {
//                  rej(err);
//                 }
//           });
//           this.onReject.push(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           });
//         } else if (this.state === "fulfilled") {
//           setTimeout(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           })
//         } else {
//           setTimeout(() => {
//             // 关键：捕获fail抛出的错误，交给rej
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           })
//         }
//       });
//     }
//     catch(failCb) {
//       return this.then(null, failCb);
//     }
//   }

//   // 测试
//   console.log(1)
//   const promise = new MyPromise((resolve, reject) => {
//     console.log(2)
//     resolve('success');
//   });
//   promise.then(res => {
//     console.log(res);
//     return res
//   }).then(r => {
//     console.log(r);
//   })
//   .catch(err => {
//     console.log(err); // 正常打印 success
//   });
//   console.log(3)

// TODO2:手写Promise.all
// class MyPromise {
//     constructor(executor) {
//       this.state = "pending";
//       this.value = undefined;
//       this.onResolve = [];
//       this.onReject = [];

//       const resolve = (v) => {
//         if (this.state !== "pending") return;
//         this.state = "fulfilled";
//         this.value = v;
//         this.onResolve.forEach(fn => setTimeout(() => fn(v)));
//       };
//       const reject = (e) => {
//         if (this.state !== "pending") return;
//         this.state = "rejected";
//         this.value = e;
//         this.onReject.forEach(fn => setTimeout(() => fn(e)));
//       };

//       try { executor(resolve, reject); }
//       catch (err) { reject(err); }
//     }

//     then(success, fail) {
//       success = success || (v => v);
//       fail = fail || (e => { throw e; });
//       return new MyPromise((res, rej) => {
//         if (this.state === "pending") {
//           this.onResolve.push(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           });
//           this.onReject.push(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           });
//         } else if (this.state === "fulfilled") {
//           setTimeout(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           })
//         } else {
//           setTimeout(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           })
//         }
//       });
//     }
//     catch(failCb) {
//       return this.then(null, failCb);
//     }

//     // 静态 all 方法
//     static all(promiseArr) {
//       return new MyPromise((resolve, reject) => {
//         const len = promiseArr.length;
//         // 空数组直接成功
//         if (len === 0) return resolve([]);

//         const result = [];
//         let successCount = 0;

//         promiseArr.forEach((item, index) => {
//           // 统一转为MyPromise实例（兼容普通值）
//           MyPromise.resolve(item).then(val => {
//             // 保证结果顺序和入参一致，用index赋值
//             result[index] = val;
//             successCount++;
//             // 全部完成
//             if (successCount === len) {
//               resolve(result);
//             }
//           }).catch(err => {
//             // 任意一个失败直接拒绝
//             reject(err);
//           });
//         });
//       });
//     }

//     // 配套简易静态resolve，兼容普通值
//     static resolve(val) {
//       if (val instanceof MyPromise) return val;
//       return new MyPromise(res => res(val));
//     }
//   }
// const p1 = MyPromise.resolve(10);
// const p2 = new MyPromise(res => res(20));
// const p3 = MyPromise.resolve(30);

// // MyPromise.all([p1, p2, p3])
// //   .then(res => console.log('全部成功', res)) // [10,20,30]
// //   .catch(err => console.log('失败', err));

// // 失败测试
// const pErr = new MyPromise((res, rej) => rej('接口失败'));
// MyPromise.all([p1, pErr, p3]).catch(e => console.log(e)); // 接口失败

// TODO3:手写Promise.race
// class MyPromise {
//     constructor(executor) {
//       this.state = "pending";
//       this.value = undefined;
//       this.onResolve = [];
//       this.onReject = [];

//       const resolve = (v) => {
//         if (this.state !== "pending") return;
//         this.state = "fulfilled";
//         this.value = v;
//         this.onResolve.forEach(fn => fn(v));
//       };
//       const reject = (e) => {
//         if (this.state !== "pending") return;
//         this.state = "rejected";
//         this.value = e;
//         this.onReject.forEach(fn => fn(e));
//       };

//       try { executor(resolve, reject); }
//       catch (err) { reject(err); }
//     }

//     then(success, fail) {
//       success = success || (v => v);
//       fail = fail || (e => { throw e; });
//       return new MyPromise((res, rej) => {
//         if (this.state === "pending") {
//           this.onResolve.push(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           });
//           this.onReject.push(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           });
//         } else if (this.state === "fulfilled") {
//           setTimeout(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           })
//         } else {
//           setTimeout(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           })
//         }
//       });
//     }
//     catch(failCb) {
//       return this.then(null, failCb);
//     }

//     static resolve(val) {
//       if (val instanceof MyPromise) return val;
//       return new MyPromise(res => res(val));
//     }

//     static race(promiseArr) {
//       return new MyPromise((resolve, reject) => {
//         let isDone = false;
//         promiseArr.forEach(task => {
//           MyPromise.resolve(task)
//             .then(res => {
//               if (!isDone) {
//                 isDone = true;
//                 resolve(res);
//               }
//             })
//             .catch(err => {
//               if (!isDone) {
//                 isDone = true;
//                 reject(err);
//               }
//             });
//         });
//       });
//     }
//   }

//   // 测试：稳定输出 快
//   const p1 = new MyPromise(res => setTimeout(() => res('慢'), 1000));
//   const p2 = new MyPromise(res => setTimeout(() => res('快'), 200));
//   MyPromise.race([p1, p2]).then(res => console.log(res));

// // 失败优先
// const p3 = new MyPromise((res, rej) => setTimeout(() => rej('提前失败'), 100));
// const p4 = new MyPromise(res => setTimeout(() => res('成功'), 500));
// MyPromise.race([p3, p4]).catch(e => console.log(e)); // 输出：提前失败

// TODO4:手写promise.allettled
// class MyPromise {
//     constructor(executor) {
//       this.state = "pending";
//       this.value = undefined;
//       this.onResolve = [];
//       this.onReject = [];

//       const resolve = (v) => {
//         if (this.state !== "pending") return;
//         this.state = "fulfilled";
//         this.value = v;
//         this.onResolve.forEach(fn => fn(v));
//       };
//       const reject = (e) => {
//         if (this.state !== "pending") return;
//         this.state = "rejected";
//         this.value = e;
//         this.onReject.forEach(fn => fn(e));
//       };

//       try { executor(resolve, reject); }
//       catch (err) { reject(err); }
//     }

//     then(success, fail) {
//       success = success || (v => v);
//       fail = fail || (e => { throw e; });
//       return new MyPromise((res, rej) => {
//         if (this.state === "pending") {
//           this.onResolve.push(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           });
//           this.onReject.push(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           });
//         } else if (this.state === "fulfilled") {
//           setTimeout(() => {
//             try { res(success(this.value)); } catch (err) { rej(err); }
//           })
//         } else {
//           setTimeout(() => {
//             try { rej(fail(this.value)); } catch (err) { rej(err); }
//           })
//         }
//       });
//     }
//     catch(failCb) {
//       return this.then(null, failCb);
//     }

//     finally(cb) {
//         return this.then(
//           val => MyPromise.resolve(cb()).then(() => val),
//           err => MyPromise.resolve(cb()).then(() => { throw err; })
//         )
//       }

//     static resolve(val) {
//       if (val instanceof MyPromise) return val;
//       return new MyPromise(res => res(val));
//     }

//     // 新增 allSettled
//     static allSettled(promiseArr) {
//       return new MyPromise((resolve) => {
//         const len = promiseArr.length;
//         if (len === 0) return resolve([]);

//         const result = [];
//         let finishedCount = 0;

//         promiseArr.forEach((task, index) => {
//           MyPromise.resolve(task)
//             .then(val => {
//               result[index] = { status: "fulfilled", value: val };
//             })
//             .catch(err => {
//               result[index] = { status: "rejected", reason: err };
//             })
//             .finally(() => {
//               finishedCount++;
//               if (finishedCount === len) {
//                 resolve(result);
//               }
//             });
//         });
//       });
//     }
//   }

//   const p1 = MyPromise.resolve(100);
// const p2 = new MyPromise((res, rej) => setTimeout(() => rej("接口超时"), 300));
// const p3 = new MyPromise(res => setTimeout(() => res(200), 100));

// MyPromise.allSettled([p1, p2, p3]).then(res => {
//   console.log(res);
//   /*
//   [
//     { status: 'fulfilled', value: 100 },
//     { status: 'rejected', reason: '接口超时' },
//     { status: 'fulfilled', value: 200 }
//   ]
//   */
// });
