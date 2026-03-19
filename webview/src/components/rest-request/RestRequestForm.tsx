import { useMemo, useState } from "react";
import {
    type Query,
    type Request,
    STANDARD_METHODS,
} from "../../../../shared/types";
import { buildUrl } from "../../../../shared/util";
import { BodyTab } from "./BodyTab";
import { KeyValueTab } from "./KeyValueTab";

export const RestRequestForm = ({
    request,
    setRequest,
}: {
    request: Request;
    setRequest: (request: Request) => void;
}) => {
    const [currentTab, setCurrentTab] = useState<Tab>("Query");
    const [editingUrl, setEditingUrl] = useState(false);
    const [rawUrl, setRawUrl] = useState(request.url);
    const displayUrl = useMemo(() => {
        return buildUrl(request.url, request.queryParams);
    }, [request.url, request.queryParams]);

    return (
        <>
            <div className="input-group mb-3">
                <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    {request.method}
                </button>
                <ul className="dropdown-menu">
                    {STANDARD_METHODS.map((method) => (
                        <li key={method}>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setRequest({ ...request, method });
                                }}
                            >
                                {method}
                            </a>
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with dropdown button"
                    placeholder="Enter URL"
                    onFocus={() => setEditingUrl(true)}
                    onBlur={() => {
                        const newQueries = parseQueryParams(rawUrl);
                        const queryParams = [...request.queryParams];
                        queryParams.forEach((q) => {
                            if (newQueries.has(q.key)) {
                                q.active = true;
                                q.value = newQueries.get(q.key) || "";
                            }
                        });
                        for (const [key, value] of newQueries.entries()) {
                            if (
                                queryParams.find((q) => q.key === key) ===
                                undefined
                            ) {
                                queryParams.push({
                                    active: true,
                                    key,
                                    value,
                                });
                            }
                        }
                        setRequest({
                            ...request,
                            url: parseBaseUrl(rawUrl),
                            queryParams,
                        });
                        setRawUrl(parseBaseUrl(rawUrl))
                        setEditingUrl(false);
                    }}
                    onChange={(e) => setRawUrl(e.target.value)}
                    value={editingUrl ? rawUrl : displayUrl}
                />
            </div>
            <ul className="nav nav-pills">
                {ALLOWED_TABS.map((tab) => (
                    <li className="nav-item" key={tab}>
                        <a
                            className={`nav-link ${currentTab === tab ? "active" : ""}`}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentTab(tab);
                            }}
                        >
                            {tab}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="mt-2 px-3 py-1 fs-5">
                {currentTab === "Query" && (
                    <KeyValueTab
                        title="Query Parameters"
                        keyValEntries={request.queryParams}
                        onChange={(entries) => {
                            setRequest({
                                ...request,
                                queryParams: entries,
                            });
                        }}
                    />
                )}
                {currentTab === "Headers" && (
                    <KeyValueTab
                        title="Headers"
                        keyValEntries={request.headers}
                        onChange={(entries) => {
                            setRequest({ ...request, headers: entries });
                        }}
                    />
                )}
                {currentTab === "Auth" && <div>Auth</div>}
                {currentTab === "Body" && (
                    <BodyTab
                        content={request.body}
                        onChangeContent={(body) =>
                            setRequest({ ...request, body })
                        }
                        onChangeFile={(file) =>
                            setRequest({ ...request, file })
                        }
                    />
                )}
            </div>
            <pre>{JSON.stringify(request, null, 2)}</pre>
        </>
    );
};

const ALLOWED_TABS = ["Query", "Headers", "Auth", "Body"] as const;
type Tab = (typeof ALLOWED_TABS)[number];

const parseBaseUrl = (noHttpPrefixUrl: string): string => {
    const paramStart = noHttpPrefixUrl.indexOf("?");
    if (paramStart !== -1) {
        return noHttpPrefixUrl.substring(0, paramStart);
    }
    return noHttpPrefixUrl;
};

const parseQueryParams = (url: string): Map<string, string> => {
    const paramStart = url.indexOf("?");
    const ans = new Map();
    if (paramStart === -1) {
        return ans;
    }
    const paramStrings = url.substring(paramStart + 1).split("&");
    paramStrings
        .map((s) => s.split("="))
        .filter((parts) => parts.length === 2)
        .forEach((parts) => ans.set(parts[0], parts[1]));
    return ans;
};
