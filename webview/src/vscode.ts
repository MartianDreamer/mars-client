export {};

declare global {
    function acquireVsCodeApi<T = any, R = unknown>(): {
        postMessage: (message: R) => void;
        getState: () => T;
        setState: (state: T) => void;
    };
}
