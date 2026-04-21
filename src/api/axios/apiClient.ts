// src/api/apiClient.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "../../config/env";
import keycloakInstance from "../../auth/keycloak";
import { keycloakService } from "../../auth/keycloakService";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: ENV.BASE_URL,
});

// Добавление и обновление токена перед запросом
apiClient.interceptors.request.use(async (config) => {
  const token = await keycloakService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Обработка 401: пробуем обновить токен и повторить запрос один раз
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await keycloakService.refreshAccessToken(true);

      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }

      keycloakInstance.logout({ redirectUri: window.location.origin });
    }

    return Promise.reject(error);
  }
);
