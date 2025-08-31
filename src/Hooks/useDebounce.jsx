import { useEffect, useRef, useState } from "react";

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);
  const timeRef = useRef(null);

  useEffect(() => {
    function clearTimer() {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }

    clearTimer();

    timeRef.current = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimer();
    };
  }, [value, delay]);

  return debounceValue;
};

export default useDebounce;