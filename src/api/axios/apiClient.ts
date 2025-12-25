// src/api/apiClient.ts
import axios from "axios";
import { ENV } from "../../config/env";
import keycloakInstance from "../../auth/keycloak";

export const apiClient = axios.create({
  baseURL: ENV.BASE_URL,
});

// Добавление токена в заголовки запроса
apiClient.interceptors.request.use((config) => {
  if (keycloakInstance.token) {
    config.headers.Authorization = `Bearer ${keycloakInstance.token}`;
  }
  return config;
});

// Обработка ошибок ответа
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Logging out");
      keycloakInstance.logout({ redirectUri: window.location.origin });
    }
    return Promise.reject(error);
  }
);
