export const addHttpPrefix = (urlString: string): string => {
    if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
        return urlString;
    }
    return "http://" + urlString.replace(/^:/, "").replace(/^\/+/, "");
};

export const buildUrl = (url: string, queryParams: Query[]): string => {
    const queryParamsAsString = encodeURI(
        queryParams
            .filter((q) => q.active)
            .filter((q) => q.value.trim() !== "")
            .map((q) => `${q.key}=${q.value}`)
            .join("&"),
    );
    let ans = "";
    if (url.trim() !== "") {
        ans = addHttpPrefix(url);
    }
    if (queryParamsAsString.trim() !== "") {
        ans += "?" + queryParamsAsString;
    }
    return ans;
};

type Query = {
    active: boolean;
    key: string;
    value: string;
};
