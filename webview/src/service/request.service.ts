import type { Request } from "../../../shared/types";

export type Action = "save" | "send";

interface RequestPayload {
    action: Action;
    request: Request;
}

const vscode = acquireVsCodeApi<unknown, RequestPayload>();

export const sendMessage = (action: Action, request: Request) => {
    vscode.postMessage({
        action,
        request,
    });
};
