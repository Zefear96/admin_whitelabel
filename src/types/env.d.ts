export {};

declare global {
  interface Window {
    _env_: {
      VITE_APP_NAME?: string;
      VITE_APP_VERSION?: string;
      VITE_KEYCLOAK_URL?: string;
      VITE_BASE_URL?: string;
      VITE_KEYCLOAK_REALM?: string;
      VITE_KEYCLOAK_CLIENT?: string;
    };
  }
}