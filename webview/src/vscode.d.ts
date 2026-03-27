export {};

declare global {
    function acquireVsCodeApi<T = unknown, R>(): {
        postMessage: (message: R) => void;
        getState: () => T;
        setState: (state: T) => void;
    };
}
