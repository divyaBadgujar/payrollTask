import { useEffect, useRef, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function clearTimer() {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
        timeRef.current = null;
      }
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
}

export default useDebounce;
