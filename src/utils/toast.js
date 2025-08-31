import { toast as tst } from "react-hot-toast";

const options = {
  duration: 3000,
  position: "top-center",
};

const success = (msg) => {
  return tst.success(msg, options);
};

const error = (msg) => {
  return tst.error(msg, options);
};

const promise = (myPromise, msgObj) => {
  return tst.promise(myPromise, msgObj, options);
};

const toast = {
  success,
  error,
  promise,
};

export default toast;