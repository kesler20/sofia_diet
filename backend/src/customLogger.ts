import path from "path";

// Save original console methods
const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

// Override console.info
console.info = (...args: any[]) => {
  const timestamp = new Date().toLocaleTimeString();
  const filePath = path.dirname(__filename);
  originalConsoleInfo(`[INFO] ${timestamp} ${filePath}`, ...args);
};

// Override console.error
console.error = (...args: any[]) => {
  const timestamp = new Date().toLocaleTimeString();
  const filePath = path.dirname(__filename);
  originalConsoleError(`[ERROR] ${timestamp} ${filePath}`, ...args);
};
