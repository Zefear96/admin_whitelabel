import type { Role } from "../roles";

export interface UserKeycloakType {
  name: string;
  email?: string;
  firstName?: string;
  secondName?: string;
  token: string;
  id: string;
  roles: Role[];
  /**
   * In-memory only (React state / keycloak-js). Never persisted to localStorage.
   * After F5 the session is restored via Keycloak check-sso + silent SSO.
   */
  refreshToken?: string;
  idToken?: string;
  timeSkew?: number;
}
