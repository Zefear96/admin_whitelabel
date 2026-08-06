import Keycloak, { type KeycloakInitOptions } from "keycloak-js";
import { ENV } from "../config/env";

const keycloakInstance = new Keycloak({
  url: ENV.KEYCLOAK_URL,
  realm: ENV.KEYCLOAK_REALM,
  clientId: ENV.KEYCLOAK_CLIENT,
});

/**
 * Single shared init promise for the whole app.
 * Prevents React Strict Mode / remount from calling keycloak.init() twice
 * (second call throws and was incorrectly treated as "not authenticated").
 */
let keycloakInitPromise: Promise<boolean> | null = null;

export const ensureKeycloakInit = (options: KeycloakInitOptions): Promise<boolean> => {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloakInstance.init(options);
  }
  return keycloakInitPromise;
};

export default keycloakInstance;
