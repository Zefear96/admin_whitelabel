import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  exp?: number;
  role?: string;
  roles?: string[];
}

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}