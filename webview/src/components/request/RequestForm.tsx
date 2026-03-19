import { useEffect, useState } from "react";
import { type Headers, type Request, STANDARD_METHODS } from "../../types";
import { KeyValueTab } from "./KeyValueTab";
import type { Query } from "./types";
import { BodyTab } from "./BodyTab";

export const RequestForm = () => {
    const [request, setRequest] = useState<Request>({
        method: "GET",
        url: "",
        headers: {},
    });
    const [queries, setQueries] = useState<Query[]>([]);

    const [currentTab, setCurrentTab] = useState<Tab>("Query");

    useEffect(() => {
        try {
            const url = new URL(request.url);
            queries
                .filter((q) => q.active)
                .filter((q) => q.value.trim() !== "")
                .filter((q) => url.searchParams.get(q.key) !== q.value)
                .forEach((q) => url.searchParams.set(q.key, q.value));

            if (url.toString() === request.url) {
                return;
            }
            setRequest({
                ...request,
                url: url.toString(),
            });
        } catch (e) {
            console.log("Invalid URL");
        }
    }, [queries]);

    useEffect(() => {
        try {
            const url = new URL(request.url);
            const queryList: Query[] = [];
            url.searchParams.forEach((value, key) => {
                queryList.push({
                    key,
                    value,
                    active: true,
                });
            });
            setQueries(queryList);
            console.log("URL updated, queries synced");
        } catch (e) {
            console.log("Invalid URL");
        }
    }, [request]);

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
                    onChange={(e) =>
                        setRequest({ ...request, url: e.target.value })
                    }
                    value={request.url}
                    onBlur={(e) => {
                        e.preventDefault();
                        if (
                            !request.url.startsWith("http://") &&
                            !request.url.startsWith("https://")
                        ) {
                            setRequest({
                                ...request,
                                url: "http://" + request.url,
                            });
                        }
                    }}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                                !request.url.startsWith("http://") &&
                                !request.url.startsWith("https://")
                            ) {
                                setRequest({
                                    ...request,
                                    url: "http://" + request.url,
                                });
                            }
                        }
                    }}
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
                        keyValEntries={queries}
                        onChange={setQueries}
                    />
                )}
                {currentTab === "Headers" && (
                    <KeyValueTab
                        title="Headers"
                        keyValEntries={Object.entries(request.headers).map(
                            ([key, value]) => ({
                                key,
                                value,
                                active: true,
                            }),
                        )}
                        onChange={(entries) => {
                            const newHeaders: Headers = {};
                            entries
                                .filter((e) => e.active)
                                .filter((e) => e.value.trim() !== "")
                                .forEach((e) => {
                                    newHeaders[e.key] = e.value;
                                });
                            setRequest({ ...request, headers: newHeaders });
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
                        onChangeFile={(file) => setRequest({ ...request, file })}
                    />
                )}
            </div>
            <pre>{JSON.stringify(request, null, 2)}</pre>
            <pre>{JSON.stringify(queries, null, 2)}</pre>
        </>
    );
};

const ALLOWED_TABS = ["Query", "Headers", "Auth", "Body"] as const;
type Tab = (typeof ALLOWED_TABS)[number];
