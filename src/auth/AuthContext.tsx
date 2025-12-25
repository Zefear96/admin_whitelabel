import { createContext } from "react";
import type { UserKeycloakType } from "../types/client/user";
import type KeycloakInstance from "keycloak-js";

export interface AuthContextType {
  keycloak: KeycloakInstance;
  initialized: boolean;
  authenticated: boolean;
  user: UserKeycloakType | null;
  isLoading: boolean;
  login: () => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
