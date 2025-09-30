import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "@/config/env";
import { deleteLocalStorage, getLocalStorage } from "./storage";

// Create Axios instance
export const axiosInstance = axios.create({
    baseURL: env.apiBaseUrl,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (requestConfig) => {
        // You can add global headers or logging here
        return requestConfig;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here
        return Promise.reject(error);
    }
);

export interface ClientOptions {
    body?: any;
    method?: string;
    contentType?: string;
    accessToken?: string;
    includeAuthorization?: boolean;
    [key: string]: any;
}

export async function client(
    url: string,
    {
        body,
        method = "GET",
        contentType = "application/json",
        accessToken = getLocalStorage("token"),
        includeAuthorization = true,
        ...customConfig
    }: ClientOptions = {}
): Promise<{ status: boolean; data: any; message?: string; error?: any }> {
    const requestConfig: AxiosRequestConfig = {
        url,
        method,
        headers: {
            "Content-Type": contentType,
            ...((includeAuthorization && accessToken) ? { "x-auth-token": `${accessToken}` } : {})
        },
        data: method === "GET" ? undefined : body,
        ...customConfig,
    };
    try {
        const response: AxiosResponse = await axiosInstance(requestConfig);
        const data = response.data;
        const { status, ...restData } = data || {};
        if (response.status === 200) {
            return {
                status: true,
                data: restData,
            };
        }
        return {
            status: false,
            data: restData,
            message: data?.status,
        };
    } catch (err: any) {
        console.log("first,", err);
        if (err?.request?.status === 401) {
            // const redirectURL = (location.pathname?.includes("telecaller")) ? "/telecaller/login" : "/login";
            deleteLocalStorage("token");
            deleteLocalStorage("username");
            document.location.href = "/";
        }
        return {
            status: false,
            data: err?.response?.data || null,
            message: err?.response?.data?.msg || err?.message,
            error: err,
        };
    }
}

client.get = function (url: string, customConfig: ClientOptions = {}) {
    return client(url, { ...customConfig, method: "GET" });
};

client.post = function (url: string, body: any, customConfig: ClientOptions = {}) {
    return client(url, { ...customConfig, method: "POST", body });
};

client.put = function (url: string, body: any, customConfig: ClientOptions = {}) {
    return client(url, { ...customConfig, method: "PUT", body });
};

client.delete = function (url: string, body: any, customConfig: ClientOptions = {}) {
    return client(url, { ...customConfig, method: "DELETE", body });
};
