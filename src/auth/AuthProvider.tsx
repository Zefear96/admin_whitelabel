import { useState, useEffect, useRef, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import keycloakInstance from "./keycloak";
import type { UserKeycloakType } from "../types/keycloak/userKeycloakType";
import type { Props } from "../types/propsType";
import type { AuthContextType } from "../types/keycloak/authContextType";

const USER_STORAGE_KEY = "kc_user";

export default function AuthProvider({ children }: Props) {
  const isRun = useRef(false);

  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<UserKeycloakType | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // ---------------- INIT ----------------
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const basePath = import.meta.env.BASE_URL || "/backoffice";
    const silentCheckSsoUri =
      window.location.origin + basePath + "/silent-check-sso.html";

    keycloakInstance
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: true,
        silentCheckSsoRedirectUri: silentCheckSsoUri,
      })
      .then((auth) => {
        setAuthenticated(auth);

        if (auth && keycloakInstance.tokenParsed) {
          const p: any = keycloakInstance.tokenParsed;

          const userData: UserKeycloakType = {
            id: p.sub,
            name: p.name,
            email: p.email,
            firstName: p.given_name,
            secondName: p.family_name,
            roles: p.roles || [],
            token: keycloakInstance.token!, // можно убрать, если не нужен
          };

          setUser(userData);
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(userData)
          );
        } else {
          setUser((prev) => prev);
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
    const basePath = import.meta.env.BASE_URL || "/backoffice";
    keycloakInstance.login({
      redirectUri: window.location.origin + basePath,
    });
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    const basePath = import.meta.env.BASE_URL || "/backoffice";

    // очищаем локальные данные
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);

    // полный SSO logout
    window.location.href = keycloakInstance.createLogoutUrl({
      redirectUri: window.location.origin + basePath + "/logout",
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
