// Standard RFC 9110 Methods
export const GET = "GET";
export const POST = "POST";
export const PUT = "PUT";
export const DELETE = "DELETE";
export const PATCH = "PATCH";
export const HEAD = "HEAD";
export const OPTIONS = "OPTIONS";
export const TRACE = "TRACE";
export const CONNECT = "CONNECT";

export const STANDARD_METHODS = [
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD,
    OPTIONS,
    TRACE,
    CONNECT,
] as const;

// Extended & WebDAV Methods
export const PROPFIND = "PROPFIND";
export const PROPPATCH = "PROPPATCH";
export const MKCOL = "MKCOL";
export const COPY = "COPY";
export const MOVE = "MOVE";
export const LOCK = "LOCK";
export const UNLOCK = "UNLOCK";
export const SEARCH = "SEARCH";
export const QUERY = "QUERY";
export const PURGE = "PURGE";

export const EXTENDED_METHODS = [
    PROPFIND,
    PROPPATCH,
    MKCOL,
    COPY,
    MOVE,
    LOCK,
    UNLOCK,
    SEARCH,
    QUERY,
    PURGE,
] as const;

export const ALL_HTTP_METHODS = [
    ...STANDARD_METHODS,
    ...EXTENDED_METHODS,
] as const;

export type HttpMethod = (typeof ALL_HTTP_METHODS)[number];

export type BodyType = "none" | "text" | "json" | "form-data" | "binary";

export type Headers = {
    [key: string]: string;
};

export interface Request {
    method: HttpMethod;
    headers: Headers;
    body?: string;
    url: string;
    file?: File;
}

export interface Response {
    status: number;
    headers: Headers;
    body?: string;
    statusText: string;
    elapsedTime: number;
    size?: number;
}
