import { defineAsyncComponent, h } from 'vue';
import { Spin } from '@arco-design/web-vue';

export const noop = () => {};
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
interface Options {
  size?: number;
  delay?: number;
  timeout?: number;
  loading?: boolean;
  retry?: boolean;
}
export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const {
    size = 30,
    delay = 100,
    timeout = 30000,
    loading = false,
    retry = true,
  } = options;
  return defineAsyncComponent({
    loader,
    loadingComponent: loading
      ? h(Spin, {
          size,
          loading,
          dot: true,
        })
      : undefined,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout,
    // errorComponent
    // Defining if component is suspensible. Default: true.
    // suspensible: false,
    delay,
    /**
     *
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError: !retry
      ? noop
      : // eslint-disable-next-line no-shadow
        (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            // retry on fetch errors, 3 max attempts
            retry();
          } else {
            // Note that retry/fail are like resolve/reject of a promise:
            // one of them must be called for the error handling to continue.
            fail();
          }
        },
  });
}
