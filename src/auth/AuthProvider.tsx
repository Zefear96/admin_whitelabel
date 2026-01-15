import { useState, useEffect, useRef, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import keycloakInstance from "./keycloak";
import type { UserKeycloakType } from "../types/keycloak/userKeycloakType";
import type { Props } from "../types/propsType";
import type { AuthContextType } from "../types/keycloak/authContextType";

export default function AuthProvider({ children }: Props) {
  const isRun = useRef(false);

  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserKeycloakType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    // Базовый путь приложения
    const basePath = import.meta.env.BASE_URL || '/backoffice/';

    keycloakInstance
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: true,
        silentCheckSsoRedirectUri:
          window.location.origin + basePath + "silent-check-sso.html",
      })
      .then((auth) => {
        setAuthenticated(auth);

        if (auth && keycloakInstance.tokenParsed) {
          const p: any = keycloakInstance.tokenParsed;

          setUser({
            id: p.sub,
            name: p.name,
            email: p.email,
            firstName: p.given_name,
            secondName: p.family_name,
            token: keycloakInstance.token!,
            roles: p.roles || [],
          });
        }

        setInitialized(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Keycloak init error", err);
        setInitialized(true);
        setIsLoading(false);
      });
  }, []);

  // ---------------- LOGIN ----------------
  const login = useCallback(() => {
    const basePath = import.meta.env.BASE_URL || '/backoffice/';
    keycloakInstance.login({
      redirectUri: window.location.origin + basePath,
    });
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    const basePath = import.meta.env.BASE_URL || '/backoffice/';
    window.location.href = keycloakInstance.createLogoutUrl({
      redirectUri: window.location.origin + basePath + "logout",
    });
  }, []);

  const value: AuthContextType = {
    keycloak: keycloakInstance,
    initialized,
    authenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
