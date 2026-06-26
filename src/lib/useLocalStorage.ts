import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        setStoredValue(JSON.parse(item));
      } catch {
        setStoredValue(item as T);
      }
    }
  }, [key]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("local-storage", (e) =>
      handleStorage(e as StorageEvent),
    );
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("local-storage", (e) =>
        handleStorage(e as StorageEvent),
      );
    };
  }, [key]);

  const setValue = (value: T) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  };

  return [storedValue, setValue];
}
