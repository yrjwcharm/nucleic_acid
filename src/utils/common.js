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

/**
 * 节流
 */
export function throttle(func, wait) {
    let timeout;
    return function (...rest) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(this, rest)
        }, wait)
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
