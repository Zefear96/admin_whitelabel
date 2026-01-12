import type { Role } from "../roles";

export interface UserKeycloakType {
  name: string;
  email?: string;
  firstName?: string;
  secondName?: string;
  token: string;
  id: string
  roles: Role[];
}