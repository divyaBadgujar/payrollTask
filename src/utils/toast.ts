import { toast as tst } from "react-hot-toast";

const options = {
  duration: 3000,
  position: "top-center" as const,
};

const success = (msg: string) => {
  return tst.success(msg, options);
};

const error = (msg: string) => {
  return tst.error(msg, options);
};

/**
 * Show a toast for a promise
 * @param myPromise - Promise to track
 * @param msgObj - Object with loading, success, and error messages
 */
const promise = <T = unknown>(
  myPromise: Promise<T>,
  msgObj: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: any) => string);
  }
) => {
  return tst.promise(myPromise, msgObj, options);
};

const toast = {
  success,
  error,
  promise,
};

export default toast;
