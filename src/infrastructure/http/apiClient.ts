import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
    timeout: 5000,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                window.dispatchEvent(new CustomEvent("auth:expired"));
            }

            if (!error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
                window.dispatchEvent(new CustomEvent("network:midflight-error"));
            }
        }
        return Promise.reject(error);
    },
);
