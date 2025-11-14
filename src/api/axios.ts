import axios from "axios";
import keycloak from "../config/keycloak/keycloak";

export const apiClient = axios.create({
  // baseURL: "https://key.eib.kg",
  baseURL: "https://ff8c4f88-1fb1-4ee4-9d3d-83f827af4f00.mock.pstmn.io"
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