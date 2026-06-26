export const dataToQueryParameter = (data) => {
    if (typeof data === "object") {
        if (!Array.isArray(data)) {
            var params = "?";
            const dataArray = Object.entries(data);
            if (dataArray.length > 0) {
                dataArray.forEach((entry, index) => {
                    var amp = index < dataArray.length - 1 ? "&" : "";
                    params = `${params}${entry[0]}=${entry[1]}${amp}`;
                });
                return params;
            }
        }
    } else if (typeof data === "string") {
        return data;
    }
    return "";
};