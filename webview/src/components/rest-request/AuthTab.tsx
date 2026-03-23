import { useState } from "react";
import {
    AUTH_BASIC,
    AUTH_NONE,
    AUTH_TOKEN,
    type AuthenticationData,
    type AuthenticationType,
} from "../../../../shared/types";

export const AuthTab = ({ auth, setAuth }: { auth: AuthenticationData, setAuth: (auth: AuthenticationData) => void }) => {
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
                        />
                    </div>
                    <div className="input-group mb-1">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
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
                        />
                    </div>
                    <textarea
                        className="form-control"
                        placeholder="Body content"
                        id="floatingTextarea2"
                        rows={10}
                    ></textarea>
                </>
            )}
        </>
    );
};

const ALLOWED_TABS: Tab[] = [
    { name: "None", type: AUTH_NONE, title: "No Authentication" },
    { name: "Basic", type: AUTH_BASIC, title: "Basic Authentication" },
    { name: "Token", type: AUTH_TOKEN, title: "Token Authentication" },
];
interface Tab {
    name: string;
    type: AuthenticationType;
    title: string;
}
