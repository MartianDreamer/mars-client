import { useState } from "react";
import { type AuthenticationData } from "../../../../shared/types";

export const AuthTab = ({
    auth,
    setAuth,
}: {
    auth: AuthenticationData;
    setAuth: (auth: AuthenticationData) => void;
}) => {
    const [currentTab, setCurrentTab] = useState<Tab>(ALLOWED_TABS[0]);

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
                                if (tab.name == "Basic" && auth.basic) {
                                    setAuth({
                                        ...auth,
                                        basic: {
                                            ...auth.basic,
                                            activeAt: new Date(),
                                        },
                                    });
                                } else if (tab.name == "Token" && auth.token) {
                                    setAuth({
                                        ...auth,
                                        token: {
                                            ...auth.token,
                                            activeAt: new Date(),
                                        },
                                    });
                                }
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
            </div>
            {currentTab.name === "Basic" && (
                <>
                    <div className="input-group mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={auth.basic?.username}
                            onChange={(e) => {
                                if (auth.basic) {
                                    setAuth({
                                        ...auth,
                                        basic: {
                                            ...auth.basic,
                                            username: e.target.value,
                                        },
                                    });
                                } else {
                                    setAuth({
                                        ...auth,
                                        basic: {
                                            username: e.target.value,
                                            password: "",
                                            activeAt: new Date(),
                                        },
                                    });
                                }
                            }}
                        />
                    </div>
                    <div className="input-group mb-1">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            value={auth.basic?.password}
                            onChange={(e) => {
                                if (auth.basic) {
                                    setAuth({
                                        ...auth,
                                        basic: {
                                            ...auth.basic,
                                            password: e.target.value,
                                        },
                                    });
                                } else {
                                    setAuth({
                                        ...auth,
                                        basic: {
                                            username: "",
                                            password: e.target.value,
                                            activeAt: new Date(),
                                        },
                                    });
                                }
                            }}
                        />
                    </div>
                </>
            )}
            {currentTab.name === "Token" && (
                <>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Prefix"
                            aria-label="Prefix"
                            aria-describedby="basic-addon1"
                            value={auth.token?.prefix ?? DEFAULT_TOKEN_PREFIX}
                            onChange={(e) => {
                                if (auth.token) {
                                    setAuth({
                                        ...auth,
                                        token: {
                                            ...auth.token,
                                            prefix: e.target.value,
                                        },
                                    });
                                } else {
                                    setAuth({
                                        ...auth,
                                        token: {
                                            prefix: e.target.value,
                                            token: "",
                                            activeAt: new Date(),
                                        },
                                    });
                                }
                            }}
                        />
                    </div>
                    <textarea
                        className="form-control"
                        placeholder="Body content"
                        id="floatingTextarea2"
                        rows={10}
                        value={auth.token?.token}
                        onChange={(e) => {
                            if (auth.token) {
                                setAuth({
                                    ...auth,
                                    token: {
                                        ...auth.token,
                                        token: e.target.value,
                                    },
                                });
                            } else {
                                setAuth({
                                    ...auth,
                                    token: {
                                        prefix: DEFAULT_TOKEN_PREFIX,
                                        token: e.target.value,
                                        activeAt: new Date(),
                                    },
                                });
                            }
                        }}
                    ></textarea>
                </>
            )}
        </>
    );
};

const ALLOWED_TABS: Tab[] = [
    { name: "None", title: "No Authentication" },
    { name: "Basic", title: "Basic Authentication" },
    { name: "Token", title: "Token Authentication" },
];

const DEFAULT_TOKEN_PREFIX = "Bearer";

interface Tab {
    name: string;
    title: string;
}
