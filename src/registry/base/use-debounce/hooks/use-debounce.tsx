import { useEffect, useMemo, useRef } from "react";

/**
 * Returns a stable `{ execute, cancel }` object that debounces `callback` by
 * `delay` milliseconds.
 *
 * - `execute(...args)` — schedules `callback` to run after `delay` ms,
 *   resetting the timer on every call.
 * - `cancel()` — clears any pending invocation.
 *
 * The latest `callback` reference is always used — there is no need to wrap
 * the caller in `useCallback` to avoid stale closures.
 * The returned object is stable as long as `delay` does not change.
 *
 * @param callback - Function to debounce. Updated on every render via a ref.
 * @param delay - Debounce delay in milliseconds.
 */
export function useDebounce<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  delay: number,
) {
  const callbackRef = useRef(callback);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    const debouncedFn = (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };

    const cancel = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    return { execute: debouncedFn, cancel };
  }, [delay]);
}
