import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
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
  const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "focus",
  ];

  const TOKEN_REFRESH_THRESHOLD = 60; // сек


  // -------------------- Инициализация Keycloak --------------------
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    let mounted = true;
    console.log("Starting Keycloak initialization...");

    const initKeycloak = async () => {
      try {
        const auth = await keycloakInstance.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          pkceMethod: "S256",
          flow: "standard",
          checkLoginIframe: false,
          redirectUri: window.location.origin + "/backoffice"
        });

        console.log("KC:", {
          authenticated: auth,
          token: keycloakInstance.token,
          tokenParsed: keycloakInstance.tokenParsed,
        });

        setAuthenticated(auth);

        if (auth && keycloakInstance.tokenParsed) {
          const parsed: any = keycloakInstance.tokenParsed;

          setUser({
            name: parsed.name || `${parsed.given_name || ""} ${parsed.family_name || ""}`.trim() || "-",
            email: parsed.email || "-",
            firstName: parsed.given_name || "-",
            secondName: parsed.family_name || "-",
            token: keycloakInstance.token || "-",
            id: parsed.sub || "-",
            roles: parsed.roles || [],
          });
        } else {
          setUser(null);
        }


        setInitialized(true);
        setIsLoading(false);

        // Очищаем параметры query, чтобы React Router правильно рендерил страницу
        if (window.location.search) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
        console.log('Keycloak initialized successfully, authenticated:', auth);

      } catch (e) {
        console.error("Keycloak init failed", e);
        setAuthenticated(false);
        setUser(null);

      } finally {

        setInitialized(true);
        setIsLoading(false);
      }
    };

    initKeycloak();

    return () => { mounted = false; };
  }, []);

  // -------------------- Обновление данных пользователя --------------------
  // useEffect(() => {
  //   console.log('AuthProvider user effect - initialized:', initialized, 'authenticated:', authenticated);

  //   if (!initialized || !authenticated) {
  //     setUser(null);
  //     return
  //   }

  //   if (authenticated && keycloakInstance.tokenParsed) {
  //     const parsed: any = keycloakInstance.tokenParsed;
  //     console.log('Setting user data from token:', parsed);

  //     setUser({
  //       name: parsed.name || `${parsed.given_name || ""} ${parsed.family_name || ""}`.trim() || "-",
  //       email: parsed.email || "-",
  //       firstName: parsed.given_name || "-",
  //       secondName: parsed.family_name || "-",
  //       token: keycloakInstance.token || "-",
  //       id: parsed.sub || "-",
  //       roles: parsed.roles || [],
  //     });
  //   } else {
  //     console.log('User not authenticated, clearing user data');
  //     setUser(null);
  //   }

  //   setIsLoading(false);
  // }, [initialized, authenticated]);

  const logout = useCallback(() => {
    try {
      console.log('Logging out...');
      setUser(null);
      setAuthenticated(false);
      setIsLoading(true);

      keycloakInstance.logout({
        redirectUri: window.location.origin + "/",
      });
    } catch (err) {
      console.error("Keycloak logout error:", err);
    }
  }, []);

  const value: AuthContextType = {
    keycloak: keycloakInstance,
    initialized,
    authenticated,
    isLoading,
    user,
    // login,
    logout,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


