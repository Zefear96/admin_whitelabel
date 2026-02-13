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
   * Ниже – технические поля для восстановления сессии Keycloak
   * при перезагрузке страницы. Все опциональные, чтобы не ломать
   * уже сохранённые записи в localStorage.
   */
  refreshToken?: string;
  idToken?: string;
  timeSkew?: number;
}