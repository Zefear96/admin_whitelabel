import axios from "axios";
import keycloak from "../config/keycloak/keycloak";
import { ENV } from "../config/env";

export const apiClient = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: ENV.BASE_URL,
  timeout: 10000,
});

// Логируем каждый запрос
// apiClient.interceptors.request.use((config) => {
//   console.log(
//       `API REQUEST: ${config.baseURL ?? ""}${config.url ?? ""},
//       ${config.method?.toUpperCase() ?? ""},
//       ${config.params ?? ""}`
//   );
//   return config;
// });

// apiClient.interceptors.request.use(async (config) => {
//   if (keycloak.authenticated) {
//     await keycloak.updateToken(30);
//     config.headers.Authorization = `Bearer ${keycloak.token}`;
//   }
//   return config;
// });

// // Глобальная обработка ошибок
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

apiClient.interceptors.request.use(async (config) => {
  console.log("AXIOS CONFIG:", {
    baseURL: config.baseURL,
    url: config.url,
    method: config.method,
  });

  if (!config.url) {
    console.error("❌ AXIOS REQUEST WITHOUT URL", config);
    throw new Error("Axios request without url");
  }


  // Авторизация
  if (keycloak?.authenticated) {
    try {
      await keycloak.updateToken(30);
      config.headers?.set(
        "Authorization",
        `Bearer ${keycloak.token}`
      );
    } catch (e) {
      console.error("Keycloak token refresh failed", e);
    }
  }

  return config;
},
  (error) => Promise.reject(error)
);