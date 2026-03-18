// This file only provides types to the compiler
export {}; // Ensure this is treated as a module

declare global {
  function acquireVsCodeApi<T = any, R = unknown>(): {
    postMessage(message: R): void;
    getState(): T;
    setState(data: T): void;
  };
}