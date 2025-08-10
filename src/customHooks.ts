import { useState, useEffect } from "react";

export const getResourceFromCache = <T>(key: string): T | undefined => {
  try {
    const s = localStorage.getItem(key);
    if (s === undefined || s === null) {
      return undefined;
    } else {
      return JSON.parse(s) as T;
    }
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return undefined;
  }
};

// New: read an array collection from localStorage acting like a simple DB table
export const readResourceInCache = <T>(collectionKey: string): T[] | undefined => {
  try {
    const s = localStorage.getItem(collectionKey);
    if (!s) return undefined;
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? (arr as T[]) : undefined;
  } catch (error) {
    console.error(
      `Error reading collection ${collectionKey} from localStorage`,
      error
    );
    return undefined;
  }
};

// Updated: upsert into an array collection. If uniqueKey is provided, replace existing by that key; otherwise overwrite collection with [value]
export const createResourceInCache = <T extends Record<string, any>>(
  collectionKey: string,
  value: T,
  uniqueKey?: keyof T
) => {
  try {
    if (!uniqueKey) {
      localStorage.setItem(collectionKey, JSON.stringify([value]));
      return;
    }

    const existing = readResourceInCache<T>(collectionKey) ?? [];
    const idx = existing.findIndex(
      (item) => item && item[uniqueKey] === value[uniqueKey]
    );

    if (idx >= 0) {
      existing[idx] = value;
    } else {
      existing.push(value);
    }

    localStorage.setItem(collectionKey, JSON.stringify(existing));
  } catch (error) {
    console.error(
      `Error upserting into collection ${collectionKey} in localStorage`,
      error
    );
  }
};

// New: remove from an array collection by unique key/value
export const removeResourceInCache = <T extends Record<string, any>>(
  collectionKey: string,
  uniqueKey: keyof T,
  uniqueValue: T[keyof T]
) => {
  try {
    const existing = readResourceInCache<T>(collectionKey) ?? [];
    const filtered = existing.filter(
      (item) => item && item[uniqueKey] !== uniqueValue
    );
    localStorage.setItem(collectionKey, JSON.stringify(filtered));
  } catch (error) {
    console.error(
      `Error removing from collection ${collectionKey} in localStorage`,
      error
    );
  }
};

export type ShortCut = {
  shortcut: string[];
  callback: () => void;
};

/**
 * custom hook to handle keyboard shortcuts
 * @param {*} commands
 * @param {*} deps
 * @returns
 * @example
 * const commands = [
 *  {
 *   shortcut: ["Control", "Shift", "S"],
 *  callback: () => {
 *   console.log("Control + Shift + S");
 * },
 * },
 * {
 * shortcut: ["Control", "Shift", "A"],
 * callback: () => {
 * console.log("Control + Shift + A");
 * },
 * },
 * {
 * shortcut: ["Control", "Shift", "D"],
 * callback: () => {
 * console.log("Control + Shift + D");
 * },
 * },
 * ];
 * useKeyboardShortcuts(commands);
 */
export function useKeyboardShortcuts(
  commands: ShortCut[],
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = [
        event.ctrlKey ? "Control" : "",
        event.shiftKey ? "Shift" : "",
        event.altKey ? "Alt" : "",
        event.key.toUpperCase(),
      ].filter(Boolean);

      commands.forEach(({ shortcut, callback }) => {
        if (JSON.stringify(pressedKeys) === JSON.stringify(shortcut)) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [commands, ...deps]);
}

/**
 * custom hook to store values which persist in storage and the state of the context
 * @param {*} defaultValue
 * @param {*} key
 * @returns
 */
export const useStoredValue = <T>(
  defaultValue: T,
  key: string
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(() => {
    const storedState = getResourceFromCache(key);
    console.log(
      `global state - ${key}`,
      storedState === undefined ? defaultValue : (storedState as T)
    );
    return storedState === undefined ? defaultValue : (storedState as T);
  });
  useEffect(() => {
    // Persist raw value for generic key/value storage
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage`, error);
    }
  }, [key, value]);
  return [value as T, setValue];
};
