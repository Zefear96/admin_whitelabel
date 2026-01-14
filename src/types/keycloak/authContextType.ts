import type { UserKeycloakType } from "./userKeycloakType";
import type KeycloakInstance from "keycloak-js";

export interface AuthContextType {
    keycloak: KeycloakInstance;
    initialized: boolean;
    authenticated: boolean;
    user: UserKeycloakType | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
  }
  