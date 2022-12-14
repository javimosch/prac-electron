export default function promiseSequence(arr: any[]) {
  //console.log(arr.map((v) => typeof v + v.toString()));

  return new Promise(function (resolve, reject) {
    var result: any[] = [];
    if (arr.length === 0) {
      return resolve(result);
    }
    var interval = setInterval(function () {
      if (result.length === 0) {
        var p = arr[0]();
        result[0] = p;
        p.then(function (res: any) {
          result[0] = res;
        }).catch(function (err: any) {
          result[0] = err;
        });
      }
      var last = result[result.length - 1];
      if (!(last instanceof Promise)) {
        if (last instanceof Error) {
          clearInterval(interval);
          return reject(last);
        }
        if (result.length - 1 == arr.length - 1) {
          clearInterval(interval);
          resolve(result);
        } else {
          if (typeof arr[result.length] === "function") {
            var p = arr[result.length]();
            result.push(p);
            p.then(function (res: any) {
              result[result.length - 1] = res;
            }).catch(function (err: any) {
              result[result.length - 1] = err;
            });
          }
        }
      } else {
        //wait
      }
    }, 30);
  });
}
