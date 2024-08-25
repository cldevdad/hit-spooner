import { PersistentState } from "@hit-spooner/api";
import { useState, useCallback } from "react";

/**
 * Custom hook for managing localStorage with React state.
 *
 * @param {string} key - The key under which the value is stored in
 * localStorage.
 * @param {T} initialValue - The initial value to use if the key is not found in
 * localStorage.
 * @returns {PersistentState<T>} - The stored value and a function to update it.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): PersistentState<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue] as PersistentState<T>;
}

export default useLocalStorage;
