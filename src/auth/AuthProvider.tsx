// src/context/AuthProvider.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UserKeycloakType } from "../types/client/user";
import keycloakInstance from "./keycloak";

interface Props {
  children: ReactNode;
}

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

    const initKeycloak = async () => {
      try {
        const auth = await keycloakInstance.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          pkceMethod: "S256",
          checkLoginIframe: false,
        });

        setAuthenticated(auth);
        setInitialized(true);
        setIsLoading(false);

        // if (mounted) setIsLoading(false);

        // Очистка query-параметров
        if (window.location.search) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error("Keycloak initialization failed:", error);
        setAuthenticated(false);
        if (mounted) setIsLoading(false);
      }
    };

    initKeycloak();

    return () => { mounted = false; };
  }, []);

  // -------------------- Обновление данных пользователя --------------------
  useEffect(() => {
    console.log('AuthProvider user effect - initialized:', initialized, 'authenticated:', authenticated);
    if (!initialized) return;

    if (!authenticated) {
      setUser(null);
      return;
    }

    if (authenticated && keycloakInstance.tokenParsed) {
      const parsed: any = keycloakInstance.tokenParsed;
      console.log('Setting user data from token:', parsed);

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
      console.log('User not authenticated, clearing user data');
      setUser(null);
    }

    setIsLoading(false);
  }, [initialized, authenticated]);

  // Обработчики событий Keycloak
  useEffect(() => {
    if (initialized) {
      const onAuthSuccess = () => {
        console.log('Keycloak auth success');
        setAuthenticated(true);
        if (keycloakInstance.tokenParsed) {
          const parsed: any = keycloakInstance.tokenParsed;
          setUser({
            name: parsed.name || `${parsed.given_name || ''} ${parsed.family_name || ''}`.trim() || "-",
            email: parsed.email || "-",
            firstName: parsed.given_name || "-",
            secondName: parsed.family_name || "-",
            token: keycloakInstance.token || "-",
            id: parsed.sub || "-",
            roles: parsed.roles || [],
          });
          console.log("User data: " + user?.email)
        }
      };

      const onAuthError = (error: any) => {
        console.error('Keycloak auth error:', error);
        setAuthenticated(false);
        setUser(null);
      };

      const onAuthLogout = () => {
        console.log('Keycloak auth logout');
        setAuthenticated(false);
        setUser(null);
      };

      const onTokenExpired = () => {
        console.log('Token expired, refreshing...');
        // keycloakInstance.updateToken(30).catch(() => {
        //   console.error('Token refresh failed');
        //   logout();
        // });
        logout();
      };

      keycloakInstance.onAuthSuccess = onAuthSuccess;
      keycloakInstance.onAuthError = onAuthError;
      keycloakInstance.onAuthLogout = onAuthLogout;
      keycloakInstance.onTokenExpired = onTokenExpired;

      return () => {
        keycloakInstance.onAuthSuccess = undefined;
        keycloakInstance.onAuthError = undefined;
        keycloakInstance.onAuthLogout = undefined;
        keycloakInstance.onTokenExpired = undefined;
      };
    }
  }, [initialized]);

  const login = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Attempting to login with Keycloak...');
      await keycloakInstance.login({
        redirectUri: window.location.origin
      });
      return true;
    } catch (err) {
      console.error("Keycloak login error:", err);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      console.log('Logging out...');
      setUser(null);
      setIsLoading(true);
      keycloakInstance.logout({
        redirectUri: window.location.origin
      });
    } catch (err) {
      console.error("Keycloak logout error:", err);
    }
  }, []);

  // Проверка активности клиента и обновление токена
  useEffect(() => {
    if (!initialized || !authenticated) return;

    const getTokenRemainingSeconds = (): number | null => {
      const parsed = keycloakInstance.tokenParsed;
      if (!parsed || typeof parsed.exp !== "number") return null;
      return parsed.exp - Math.floor(Date.now() / 1000);
    };

    const handleActivity = async () => {
      const remaining = getTokenRemainingSeconds();

      if (remaining !== null && remaining < TOKEN_REFRESH_THRESHOLD) {
        try {
          console.log("User active → refreshing token");
          await keycloakInstance.updateToken(TOKEN_REFRESH_THRESHOLD);
        } catch (e) {
          console.error("Token refresh failed", e);
          logout();
        }
      }
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity)
    );

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [initialized, authenticated, logout]);

  const value = { keycloak: keycloakInstance, initialized, authenticated, user, isLoading, login, logout };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
