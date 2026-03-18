const isValid = (value?: string) =>
  value && !value.startsWith("__");

const fromRuntime = (key: keyof typeof window._env_) => {
  const value = window._env_?.[key];
  return isValid(value) ? value : undefined;
};

const fromVite = (key: string) =>
  import.meta.env[key] as string | undefined;

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`❌ ENV variable ${name} is not defined`);
  }
  return value;
};

export const ENV = {
  APP_NAME: required(
    fromRuntime("VITE_APP_NAME") ?? fromVite("VITE_APP_NAME"),
    "VITE_APP_NAME"
  ),
  APP_VERSION: fromRuntime("VITE_APP_VERSION")
    ?? fromVite("VITE_APP_VERSION")
    ?? (typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : undefined)
    ?? "dev",
  BASE_URL: required(
    fromRuntime("VITE_BASE_URL") ?? fromVite("VITE_BASE_URL"),
    "VITE_BASE_URL"
  ),
  KEYCLOAK_URL: required(
    fromRuntime("VITE_KEYCLOAK_URL") ?? fromVite("VITE_KEYCLOAK_URL"),
    "VITE_KEYCLOAK_URL"
  ),
  KEYCLOAK_REALM: required(
    fromRuntime("VITE_KEYCLOAK_REALM") ?? fromVite("VITE_KEYCLOAK_REALM"),
    "VITE_KEYCLOAK_REALM"
  ),
  KEYCLOAK_CLIENT: required(
    fromRuntime("VITE_KEYCLOAK_CLIENT") ?? fromVite("VITE_KEYCLOAK_CLIENT"),
    "VITE_KEYCLOAK_CLIENT"
  ),
};


// console.log("Base URL:", ENV.BASE_URL);
  