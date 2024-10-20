import path from "path";
import { gray, cyan, red } from "colorette";

const getTime = () => {
  const now = new Date();
  return gray(`${now.toLocaleTimeString()}`);
};

// Save original console methods
const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

// Override console.info
console.info = (...args: any[]) => {
  const timestamp = getTime()
  const filePath = path.dirname(__filename);
  originalConsoleInfo(`[${cyan("INFO")}] ${timestamp} ${filePath}`, ...args);
};

// Override console.error
console.error = (...args: any[]) => {
  const timestamp = getTime()
  const filePath = path.dirname(__filename);
  originalConsoleError(`[${red("ERROR")}] ${timestamp} ${filePath}`, ...args);
};
