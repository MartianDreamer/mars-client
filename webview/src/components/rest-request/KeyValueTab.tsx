import { useState } from "react";
import type { Query } from "./types.js";

export const KeyValueTab = ({
    onChange,
    keyValEntries,
    title,
}: {
    onChange: (queries: Query[]) => void;
    keyValEntries: Query[];
    title: string;
}) => {
    const [toBeAddedQuery, setToBeAddedQuery] = useState<Query>({
        key: "",
        value: "",
        active: false,
    });

    const addQuery = () => {
        if (
            toBeAddedQuery.key.trim() !== "" ||
            toBeAddedQuery.value.trim() !== ""
        ) {
            onChange([...keyValEntries, toBeAddedQuery]);
            setToBeAddedQuery({
                key: "",
                value: "",
                active: false,
            });
        }
    };

    return (
        <>
            <p className="mb-3">{title}</p>
            {keyValEntries.map((query, index) => (
                <div className="input-group mb-1" key={index}>
                    <div className="input-group-text">
                        <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            aria-label="Checkbox for following text input"
                            checked={query.active}
                            onChange={(e) => {
                                onChange([
                                    ...keyValEntries.slice(0, keyValEntries.indexOf(query)),
                                    { ...query, active: e.target.checked },
                                    ...keyValEntries.slice(
                                        keyValEntries.indexOf(query) + 1,
                                    ),
                                ]);
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Delete") {
                                    e.preventDefault();
                                    onChange(
                                        keyValEntries.filter((q) => q !== query),
                                    );
                                }
                            }}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Text input with checkbox"
                        placeholder="Key"
                        value={query.key}
                        onChange={(e) => {
                            onChange([
                                ...keyValEntries.slice(0, keyValEntries.indexOf(query)),
                                { ...query, key: e.target.value },
                                ...keyValEntries.slice(keyValEntries.indexOf(query) + 1),
                            ]);
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Delete") {
                                e.preventDefault();
                                onChange(keyValEntries.filter((q) => q !== query));
                            }
                        }}
                    />
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Text input with checkbox"
                        placeholder="Value"
                        value={query.value}
                        onChange={(e) => {
                            onChange([
                                ...keyValEntries.slice(0, keyValEntries.indexOf(query)),
                                { ...query, value: e.target.value },
                                ...keyValEntries.slice(keyValEntries.indexOf(query) + 1),
                            ]);
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Delete") {
                                e.preventDefault();
                                onChange(keyValEntries.filter((q) => q !== query));
                            }
                        }}
                    />
                    <button
                        className="btn btn-danger"
                        type="button"
                        id="button-addon2"
                        onClick={(e) => {
                            e.preventDefault();
                            onChange(keyValEntries.filter((q) => q !== query));
                        }}
                    >
                        X
                    </button>
                </div>
            ))}

            <div className="input-group mb-1">
                <div className="input-group-text">
                    <input
                        className="form-check-input mt-0"
                        type="checkbox"
                        checked={toBeAddedQuery.active}
                        aria-label="Checkbox for following text input"
                        onChange={(e) =>
                            setToBeAddedQuery({
                                ...toBeAddedQuery,
                                active: e.target.checked,
                            })
                        }
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addQuery();
                            }
                        }}
                    />
                </div>
                <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with checkbox"
                    placeholder="Key"
                    value={toBeAddedQuery.key}
                    onChange={(e) =>
                        setToBeAddedQuery({
                            ...toBeAddedQuery,
                            key: e.target.value,
                        })
                    }
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addQuery();
                        }
                    }}
                />
                <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with checkbox"
                    placeholder="Value"
                    value={toBeAddedQuery.value}
                    onChange={(e) =>
                        setToBeAddedQuery({
                            ...toBeAddedQuery,
                            value: e.target.value,
                        })
                    }
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addQuery();
                        }
                    }}
                />
                <button
                    className="btn btn-success"
                    type="button"
                    id="button-addon2"
                    onClick={(e) => {
                        e.preventDefault();
                        addQuery();
                    }}
                >
                    +
                </button>
            </div>
        </>
    );
};
