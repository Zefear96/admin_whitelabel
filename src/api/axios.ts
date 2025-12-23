import axios from "axios";
import keycloak from "../config/keycloak/keycloak";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: "http://10.206.36.208:8117",
  // baseURL: "https://3f10da9e-5871-48ca-a97c-5704c21da2e8.mock.pstmn.io"
});

// Логируем каждый запрос
apiClient.interceptors.request.use((config) => {
  console.log(
      `API REQUEST: ${config.baseURL ?? ""}${config.url ?? ""},
      ${config.method?.toUpperCase() ?? ""},
      ${config.params ?? ""}`
  );
  return config;
});

apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    await keycloak.updateToken(30);
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

// Глобальная обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);