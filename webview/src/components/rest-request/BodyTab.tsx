import { useRef, useState } from "react";

export const BodyTab = ({
    content,
    onChangeContent,
    onChangeFile,
}: {
    content?: string;
    onChangeContent: (content?: string) => void;
    onChangeFile: (file?: File) => void;
}) => {
    const [currentTab, setCurrentTab] = useState<Tab>(ALLOWED_TABS[0]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <>
            <ul className="nav nav-underline">
                {ALLOWED_TABS.map((tab) => (
                    <li className="nav-item" key={tab.name}>
                        <a
                            className={`nav-link fs-6 ${currentTab === tab ? "active fst-medium" : ""}`}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentTab(tab);
                            }}
                        >
                            {tab.name}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="mt-2 d-flex justify-content-between">
                <p
                    style={{
                        fontSize: "1rem",
                    }}
                    className="text-dark"
                >
                    {currentTab.title}
                </p>
                {FORMAT_FUNTIONS.map((e) => e.name).includes(
                    currentTab.name,
                ) && (
                    <a
                        style={{
                            fontSize: "1rem",
                        }}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            const formatFunction = FORMAT_FUNTIONS.find(
                                (f) => f.name === currentTab.name,
                            )?.format;
                            if (formatFunction) {
                                onChangeContent(
                                    formatFunction(textAreaRef.current?.value),
                                );
                            }
                        }}
                        className="text-decoration-none text-dark"
                    >
                        Format
                    </a>
                )}
            </div>
            {currentTab.name !== "Binary" && (
                <textarea
                    ref={textAreaRef}
                    className="form-control"
                    placeholder="Body content"
                    id="floatingTextarea2"
                    rows={10}
                    value={content ?? ""}
                    onChange={(e) => onChangeContent(e.target.value)}
                ></textarea>
            )}
            {currentTab.name === "Binary" && (
                <div className="mb-3">
                    <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={(e) => onChangeFile(e.target.files?.[0])}
                    />
                </div>
            )}
        </>
    );
};

const ALLOWED_TABS = [
    { name: "JSON", title: "JSON Content" },
    { name: "Text", title: "Text Content" },
    { name: "Binary", title: "Binary Files" },
] as const;
const FORMAT_FUNTIONS = [
    {
        name: "JSON",
        format: (content?: string) => {
            if (!content) return content;
            try {
                const parsed = JSON.parse(content);
                return JSON.stringify(parsed, null, 2);
            } catch (e) {
                console.warn("failed to stringify", e)
                return content;
            }
        },
    },
];
type Tab = (typeof ALLOWED_TABS)[number];
