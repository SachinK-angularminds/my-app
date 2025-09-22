// src/axios/axiosInstance.ts
import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Notify queued requests after refresh
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// Ensure headers are always AxiosHeaders
function ensureHeaders(headers?: AxiosRequestConfig["headers"]): AxiosHeaders {
  if (!headers) return new AxiosHeaders();
  return headers instanceof AxiosHeaders ? headers : new AxiosHeaders();
}

// Request interceptor
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("accessToken");

    // Ensure headers are AxiosHeaders
    config.headers = ensureHeaders(config.headers);

    if (token) {
      config.headers.setAuthorization(`Bearer ${token}`);
    }

    return config as InternalAxiosRequestConfig;
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: CustomAxiosRequestConfig }) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue request if refresh is already in progress
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers = ensureHeaders(originalRequest.headers);
            originalRequest.headers.setAuthorization(`Bearer ${token}`);
            resolve(api(originalRequest));
          });
        });
      }

      // Start refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);

        isRefreshing = false;
        onRefreshed(newToken);

        originalRequest.headers = ensureHeaders(originalRequest.headers);
        originalRequest.headers.setAuthorization(`Bearer ${newToken}`);

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
