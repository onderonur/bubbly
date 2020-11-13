import { useState, useEffect } from 'react';

type UseSyncLocalStorageResult<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>
];

function useSyncLocalStorage<T>(
  key: string,
  defaultValue: T
): UseSyncLocalStorageResult<T> {
  const [value, setValue] = useState(
    localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key)!)
      : defaultValue
  );

  useEffect(() => {
    function handleStorageEvent(e: StorageEvent) {
      const { key: keyFromEvent, newValue } = e;
      if (keyFromEvent === key) {
        setValue(newValue ? JSON.parse(newValue) : null);
      }
    }

    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useSyncLocalStorage;
