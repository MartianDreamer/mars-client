import { useState } from "react";
import "./App.css";
import { RestRequestForm } from "./components/rest-request/RestRequestForm";
import type { Request } from "../../shared/types";

function App() {
    const [request, setRequest] = useState<Request>({
        method: "GET",
        url: "",
        headers: {},
        tags: [],
    });

    return (
        <>
            <RestRequestForm request={request} setRequest={setRequest} />
        </>
    );
}

export default App;
