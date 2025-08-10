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

export const createResourceInCache = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage`, error);
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
    createResourceInCache(key, value);
  }, [key, value]);
  return [value as T, setValue];
};
