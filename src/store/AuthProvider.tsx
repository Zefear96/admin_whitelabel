import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { UserKeycloakType } from "../types/client/User";
import type { KeycloakInstance } from "keycloak-js";
import keycloakInstance from "../config/keycloak/keycloak";

interface AuthContextType {
  // Keycloak данные
  keycloak: KeycloakInstance;
  initialized: boolean;
  authenticated: boolean;

  // Пользовательские данные
  user: UserKeycloakType | null;
  isLoading: boolean;

  // Методы
  login: () => Promise<boolean>;
  logout: () => void;
}

interface Props {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: Props) {
  // Keycloak состояния
  const isRun = useRef(false)
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);


  // Пользовательские состояния
  const [user, setUser] = useState<UserKeycloakType | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // Инициализация Keycloak
  useEffect(() => {
    if (isRun.current) return; // 🔹 защита
    isRun.current = true;

    let mounted = true;
    console.log("Starting Keycloak initialization...");

    const initKeycloak = async () => {
      try {
        const auth = await keycloakInstance.init({
          onLoad: "login-required",
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          pkceMethod: "S256",
          checkLoginIframe: false,
          thirdPartyCookies: false,
        });

        setAuthenticated(auth);
        setInitialized(true);
        setIsLoading(false);

        // Очищаем параметры query, чтобы React Router правильно рендерил страницу
        if (window.location.search) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        console.log("Keycloak initialized successfully, authenticated:", auth);
      } catch (error) {
        console.log("Keycloak initialization failed:", error);
        console.log(error);
        setAuthenticated(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    initKeycloak();

    return () => {
      mounted = false;
    };
  }, []);

  // Обработка данных пользователя
  useEffect(() => {
    console.log('AuthProvider user effect - initialized:', initialized, 'authenticated:', authenticated);

    if (!initialized || !authenticated) {
      setUser(null);
      return;
    }

    if (authenticated && keycloakInstance.tokenParsed) {
      const parsed: any = keycloakInstance.tokenParsed;
      console.log('Setting user data from token:', parsed);
      console.log("User data: ")
      setUser({
        name: parsed.name || `${parsed.given_name || ''} ${parsed.family_name || ''}`.trim() || "-",
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
  }, [initialized, authenticated, keycloakInstance.tokenParsed]);

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
        keycloakInstance.updateToken(30).catch(() => {
          console.error('Token refresh failed');
          logout();
        });
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
      keycloakInstance.logout({
        redirectUri: window.location.origin
      });
    } catch (err) {
      console.error("Keycloak logout error:", err);
    }
  }, []);

  const value: AuthContextType = {
    keycloak: keycloakInstance,
    initialized,
    authenticated,
    user,
    isLoading,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
// import type { KeycloakInstance } from "keycloak-js";
// import keycloakInstance from "../config/keycloak/keycloak";
// import type { User } from "../types/User";

// interface AuthContextType {
//   keycloak: KeycloakInstance;
//   initialized: boolean;
//   authenticated: boolean;
//   user: User | null;
//   isLoading: boolean;
//   login: () => Promise<void>;
//   logout: () => void;
// }

// interface Props {
//   children: ReactNode;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export default function AuthProvider({ children }: Props) {
//   const isRun = useRef(false);
//   const [initialized, setInitialized] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Инициализация Keycloak
//   useEffect(() => {
//     if (isRun.current) return;
//     isRun.current = true;

//     let mounted = true;

//     const initKeycloak = async () => {
//       try {
//         const auth = await keycloakInstance.init({
//           onLoad: "login-required", // "login-required" для теста, если нужно принудительно
//           checkLoginIframe: false, // iframe иногда ломает check-sso на Keycloak 25
//           // pkceMethod: "S256", // убираем для Keycloak 25
//           silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
//           enableLogging: true,
//         });

//         if (!mounted) return;

//         setAuthenticated(auth);
//         setInitialized(true);

//         if (auth && keycloakInstance.tokenParsed) {
//           const parsed: any = keycloakInstance.tokenParsed;
//           setUser({
//             name: parsed.name || `${parsed.given_name || ""} ${parsed.family_name || ""}`.trim() || "-",
//             email: parsed.email || "-",
//             firstName: parsed.given_name || "-",
//             secondName: parsed.family_name || "-",
//             token: keycloakInstance.token || "-",
//             id: parsed.sub || "-",
//             roles: parsed.roles || [],
//           });
//         } else {
//           setUser(null);
//         }

//         // очистка query params после редиректа
//         if (window.location.search) {
//           const cleanUrl = window.location.origin + window.location.pathname;
//           window.history.replaceState({}, document.title, cleanUrl);
//         }

//         console.log("Keycloak initialized:", auth);
//       } catch (err) {
//         console.error("Keycloak init failed:", err);
//         setAuthenticated(false);
//         setUser(null);
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };

//     initKeycloak();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Методы login/logout
//   const login = useCallback(async () => {
//     await keycloakInstance.login({ redirectUri: window.location.origin });
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//     keycloakInstance.logout({ redirectUri: window.location.origin });
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         keycloak: keycloakInstance,
//         initialized,
//         authenticated,
//         user,
//         isLoading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
