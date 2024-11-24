/* eslint-disable @typescript-eslint/no-explicit-any */

export const debounce = (
  fn: any,
  delay: number,
  config: {
    leading?: boolean;
    trailing?: boolean;
  } = { leading: false, trailing: true },
) => {
  if (typeof fn !== 'function') {
    throw new Error('First argument must be a function');
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  const { leading, trailing } = config;
  return function (...args: any[]) {
    if (leading && !timer) {
      fn(...args);
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (trailing) {
        fn(...args);
      }
      timer = undefined;
    }, delay);
  };
};
