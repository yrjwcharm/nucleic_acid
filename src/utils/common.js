// /**
//  * 节流
//  * @param action
//  * @param delay
//  * @returns {Function}
//  */
// export function throttle(action, delay) {
//     let last = 0;
//     return function () {
//         let curr = +new Date();
//         if (curr - last > delay) {
//             action.apply(this, arguments);
//             last = curr
//         }
//     }
// }

export function throttle (fn, delay, atleast = 0) {
  let timer = null; //定时器
  let previous = 0; //记录上一次执行的时间

  return (...args) => {
    let now = +new Date();   //当前时间戳
    if (!previous) previous = now; // 赋值开始时间

    if (atleast && (now - previous) > atleast) {
      fn.apply(this, args);  //文章下面有给出该行代码的理解
      // 重置上一次开始时间为本次结束时间
      previous = now;
      timer && clearTimeout(timer);
    } else {
      timer && clearTimeout(timer); // 清除上次定时器
      timer = setTimeout(() => {
        fn.apply(this, args);
        console.log('else')
        previous = 0;
      }, delay);
    }
  }
}

  /**
   * 防抖
   */
  export function debounce(fn, delay = 300) {
    let timer = null;
    return function (...rest) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, rest);
        timer = null;
      }, delay);
    }
  }
