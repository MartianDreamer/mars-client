import { useEffect, useRef, useState } from "react";
import {
    type AuthenticationData,
    type Request,
    STANDARD_METHODS,
} from "../../../../shared/types";
import { buildUrl } from "../../../../shared/util";
import { BodyTab } from "./BodyTab";
import { KeyValueTab } from "./KeyValueTab";
import { AuthTab } from "./AuthTab";

export const RestRequestForm = ({
    request,
    setRequest,
}: {
    request: Request;
    setRequest: (request: Request) => void;
}) => {
    const [currentTab, setCurrentTab] = useState<Tab>("Query");
    const [url, setUrl] = useState(
        buildUrl(request.baseUrl, request.queryParams),
    );
    const [addingTag, setAddingTag] = useState(false);
    const tagInputRef = useRef<HTMLInputElement>(null);

    const doUpdateAfterEditingUrl = () => {
        const newQueries = parseQueryParams(url);
        const queryParams = [...request.queryParams];
        const baseUrl = parseBaseUrl(url);
        queryParams.forEach((q) => {
            if (newQueries.has(q.key)) {
                q.active = true;
                q.value = newQueries.get(q.key) || "";
            } else {
                q.active = false;
            }
        });
        for (const [key, value] of newQueries.entries()) {
            if (queryParams.find((q) => q.key === key) === undefined) {
                queryParams.push({
                    active: true,
                    key,
                    value,
                });
            }
        }
        setRequest({
            ...request,
            baseUrl: baseUrl,
            queryParams,
        });
        setUrl(buildUrl(baseUrl, queryParams));
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUrl(buildUrl(request.baseUrl, request.queryParams));
    }, [request.queryParams, request.baseUrl]);

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
                    onBlur={() => {
                        doUpdateAfterEditingUrl();
                    }}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            doUpdateAfterEditingUrl();
                        }
                    }}
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                />
                <button
                    className="btn btn-success"
                    type="button"
                    id="button-addon2"
                    onClick={() => console.log(request)}
                >
                    Send
                </button>
            </div>
            <div className="my-2 d-flex justify-content-end">
                {addingTag ? (
                    <input
                        className="rounded-4 me-2 form-control"
                        style={{ maxWidth: "90px", fontSize: "0.875rem" }}
                        placeholder="Tag"
                        onBlur={(e) => {
                            e.preventDefault();
                            setAddingTag(false);
                            if (e.target.value.trim() !== "") {
                                setRequest({
                                    ...request,
                                    tags: [...request.tags, e.target.value],
                                });
                            }
                        }}
                        ref={tagInputRef}
                    />
                ) : (
                    <a
                        className="btn btn-dark rounded-4 me-2"
                        style={{
                            fontSize: "0.875rem",
                        }}
                        href="#"
                        role="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setAddingTag(true);
                            setTimeout(() => {
                                tagInputRef.current?.focus();
                            }, 50);
                        }}
                    >
                        <i className="nf nf-fa-plus" />
                    </a>
                )}

                {request.tags.map((tag) => (
                    <a
                        className="btn btn-dark rounded-4 me-1"
                        style={{
                            fontSize: "0.875rem",
                        }}
                        href="#"
                        role="button"
                        key={tag}
                    >
                        <span className="me-2">{tag}</span>
                        <i
                            className="nf nf-fa-trash"
                            onClick={(e) => {
                                e.preventDefault();
                                setRequest({
                                    ...request,
                                    tags: request.tags.filter((e) => e !== tag),
                                });
                            }}
                        />
                    </a>
                ))}
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
                {currentTab === "Auth" && (
                    <AuthTab
                        auth={request.auth}
                        setAuth={(auth: AuthenticationData) =>
                            setRequest({
                                ...request,
                                auth,
                            })
                        }
                    />
                )}
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
