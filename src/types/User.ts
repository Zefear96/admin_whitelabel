import type { Role } from "./roles";

export interface User {
  name: string;
  email?: string;
  firstName?: string;
  secondName?: string;
  token: string;
  id: string
  roles: Role[];
}