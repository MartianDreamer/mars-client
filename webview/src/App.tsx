import { useState } from "react";
import "./App.css";
import { RestRequestForm } from "./components/rest-request/RestRequestForm";
import { AUTH_NONE, type Request } from "../../shared/types";

function App() {
    const [request, setRequest] = useState<Request>({
        method: "GET",
        baseUrl: "baseapi.test",
        headers: [
            {
                active: true,
                key: "h1",
                value: "1",
            },
            {
                active: false,
                key: "h2",
                value: "2",
            },
        ],
        queryParams: [
            {
                active: true,
                key: "q1",
                value: "1",
            },
            {
                active: false,
                key: "q2",
                value: "2",
            },
            {
                active: true,
                key: "q3",
                value: "3",
            },
        ],
        tags: ["create user apis"],
        auth: {
            type: AUTH_NONE,
        },
    });

    return (
        <div className="p-4">
            <RestRequestForm request={request} setRequest={setRequest} />
        </div>
    );
}

export default App;
