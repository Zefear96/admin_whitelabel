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
    console.log("🔵 [AuthProvider] INIT START - useEffect triggered");
    console.log("🔵 [AuthProvider] Initial state:", {
      initialized,
      authenticated,
      isLoading,
      hasUser: !!user,
      userFromStorage: localStorage.getItem(USER_STORAGE_KEY) ? "exists" : "not found",
    });

    if (isRun.current) {
      console.log("🔵 [AuthProvider] Already initialized, skipping");
      return;
    }
    isRun.current = true;

    const basePath = import.meta.env.BASE_URL || "/backoffice";
    const silentCheckSsoUri =
      window.location.origin + basePath + "/silent-check-sso.html";
    
    console.log("🔵 [AuthProvider] Keycloak config:", {
      basePath,
      silentCheckSsoUri,
      keycloakUrl: keycloakInstance.authServerUrl,
      realm: keycloakInstance.realm,
      clientId: keycloakInstance.clientId,
    });

    // Обработчики событий Keycloak
    keycloakInstance.onAuthSuccess = () => {
      console.log("🟢 [AuthProvider] onAuthSuccess triggered (event handler)");
      console.log("🟢 [AuthProvider] Keycloak state in onAuthSuccess:", {
        authenticated: keycloakInstance.authenticated,
        hasToken: !!keycloakInstance.token,
        hasTokenParsed: !!keycloakInstance.tokenParsed,
        tokenLength: keycloakInstance.token?.length || 0,
      });
      if (keycloakInstance.authenticated && keycloakInstance.tokenParsed) {
        console.log("🟢 [AuthProvider] onAuthSuccess: Setting authenticated = true");
        setAuthenticated(true);
        const p: any = keycloakInstance.tokenParsed;
        const userData: UserKeycloakType = {
          id: p.sub,
          name: p.name,
          email: p.email,
          firstName: p.given_name,
          secondName: p.family_name,
          roles: p.roles || [],
          token: keycloakInstance.token!,
        };
        console.log("🟢 [AuthProvider] onAuthSuccess: Saving user to localStorage:", {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        });
        setUser(userData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        console.log("🟢 [AuthProvider] onAuthSuccess: User saved successfully");
      } else {
        console.log("🟡 [AuthProvider] onAuthSuccess: Conditions not met for saving user");
      }
    };

    keycloakInstance.onAuthError = () => {
      console.log("🔴 [AuthProvider] onAuthError triggered");
      console.log("🔴 [AuthProvider] Clearing authentication state");
      setAuthenticated(false);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    };

    keycloakInstance.onTokenExpired = () => {
      console.log("🟡 [AuthProvider] onTokenExpired triggered, attempting refresh");
      keycloakInstance.updateToken(30).catch((err) => {
        console.error("🔴 [AuthProvider] Failed to refresh expired token:", err);
        setAuthenticated(false);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      });
    };

    keycloakInstance
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false, // Отключаем iframe проверку, чтобы избежать проблем с асинхронностью
        // silentCheckSsoRedirectUri: `${window.location.origin}/${basePath}/silent-check-sso.html`,
        redirectUri: `${window.location.origin}/${basePath}`,
      })
      .then(async (auth) => {
        console.log("🟦 [AuthProvider] Keycloak init() completed");
        console.log("🟦 [AuthProvider] Init result:", {
          auth,
          authenticated: keycloakInstance.authenticated,
          hasToken: !!keycloakInstance.token,
          tokenLength: keycloakInstance.token?.length || 0,
          hasRefreshToken: !!keycloakInstance.refreshToken,
          refreshTokenLength: keycloakInstance.refreshToken?.length || 0,
          hasTokenParsed: !!keycloakInstance.tokenParsed,
          tokenParsed: keycloakInstance.tokenParsed ? {
            sub: keycloakInstance.tokenParsed.sub,
            name: (keycloakInstance.tokenParsed as any).name,
            email: (keycloakInstance.tokenParsed as any).email,
          } : null,
        });

        // Если есть токен, но auth === false, это может быть из-за асинхронности iframe
        // Проверяем наличие токена напрямую
        if (!auth && keycloakInstance.token && keycloakInstance.tokenParsed) {
          console.log("🟨 [AuthProvider] Token exists but auth is false, treating as authenticated");
          const isActuallyAuthenticated = true;
          console.log("🟨 [AuthProvider] Setting authenticated = true (token found)");
          setAuthenticated(isActuallyAuthenticated);
          
          const p: any = keycloakInstance.tokenParsed;
          const userData: UserKeycloakType = {
            id: p.sub,
            name: p.name,
            email: p.email,
            firstName: p.given_name,
            secondName: p.family_name,
            roles: p.roles || [],
            token: keycloakInstance.token!,
          };
          console.log("🟨 [AuthProvider] Saving user to localStorage:", userData);
          setUser(userData);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
          
          console.log("🟨 [AuthProvider] Setting initialized = true, isLoading = false");
          setInitialized(true);
          setIsLoading(false);
          console.log("🟨 [AuthProvider] Early return - user authenticated via token");
          return;
        }

        // Если check-sso не нашел сессию, но есть refreshToken, попробуем обновить токен
        if (!auth && keycloakInstance.refreshToken) {
          console.log("🟡 [AuthProvider] check-sso returned false, but refreshToken exists");
          console.log("🟡 [AuthProvider] Attempting token refresh...");
          try {
            const refreshed = await keycloakInstance.updateToken(30);
            console.log("Token refresh result:", {
              refreshed,
              authenticated: keycloakInstance.authenticated,
              hasToken: !!keycloakInstance.token,
            });
            
            if (refreshed && keycloakInstance.authenticated) {
              // Токен успешно обновлен, пользователь аутентифицирован
              console.log("🟢 [AuthProvider] Token refreshed successfully!");
              console.log("🟢 [AuthProvider] Setting authenticated = true");
              setAuthenticated(true);
              
              if (keycloakInstance.tokenParsed) {
                const p: any = keycloakInstance.tokenParsed;

                const userData: UserKeycloakType = {
                  id: p.sub,
                  name: p.name,
                  email: p.email,
                  firstName: p.given_name,
                  secondName: p.family_name,
                  roles: p.roles || [],
                  token: keycloakInstance.token!,
                };

                setUser(userData);
                localStorage.setItem(
                  USER_STORAGE_KEY,
                  JSON.stringify(userData)
                );
              }
              
              console.log("🟢 [AuthProvider] Setting initialized = true, isLoading = false");
              setInitialized(true);
              setIsLoading(false);
              console.log("🟢 [AuthProvider] Early return - user authenticated via refresh");
              return;
            } else {
              console.log("🟡 [AuthProvider] Token refresh returned false or not authenticated");
            }
          } catch (error) {
            console.error("🔴 [AuthProvider] Token refresh failed, user needs to login:", error);
            // Очищаем устаревшие данные
            console.log("🔴 [AuthProvider] Clearing localStorage and user state");
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          }
        }

        // Если auth === true, но authenticated может быть еще false из-за асинхронности
        // Проверяем актуальное состояние keycloakInstance
        const isActuallyAuthenticated = auth || keycloakInstance.authenticated;
        console.log("🟦 [AuthProvider] Final authentication check:", {
          auth,
          keycloakAuthenticated: keycloakInstance.authenticated,
          isActuallyAuthenticated,
        });
        console.log("🟦 [AuthProvider] Setting authenticated =", isActuallyAuthenticated);
        setAuthenticated(isActuallyAuthenticated);

        if (isActuallyAuthenticated && keycloakInstance.tokenParsed) {
          console.log("🟢 [AuthProvider] User is authenticated, saving user data");
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

          console.log("🟢 [AuthProvider] User data:", userData);
          setUser(userData);
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(userData)
          );
        } else {
          console.log("🔴 [AuthProvider] User is NOT authenticated");
          // Если нет аутентификации и нет refreshToken, очищаем данные
          if (!keycloakInstance.refreshToken) {
            console.log("🔴 [AuthProvider] No refreshToken, clearing localStorage");
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          } else {
            // Есть refreshToken, но нет токена - возможно iframe еще проверяет сессию
            // Даем небольшую задержку и проверяем еще раз
            console.log("🟡 [AuthProvider] No token but refreshToken exists, waiting 500ms for iframe check...");
            setTimeout(async () => {
              console.log("🟡 [AuthProvider] Delayed check: attempting token refresh...");
              try {
                if (keycloakInstance.refreshToken && !keycloakInstance.authenticated) {
                  const refreshed = await keycloakInstance.updateToken(30);
                  console.log("🟡 [AuthProvider] Delayed refresh result:", {
                    refreshed,
                    authenticated: keycloakInstance.authenticated,
                    hasToken: !!keycloakInstance.token,
                  });
                  if (refreshed && keycloakInstance.authenticated) {
                    console.log("🟢 [AuthProvider] Token refreshed after delay, user authenticated!");
                    setAuthenticated(true);
                    
                    if (keycloakInstance.tokenParsed) {
                      const p: any = keycloakInstance.tokenParsed;
                      const userData: UserKeycloakType = {
                        id: p.sub,
                        name: p.name,
                        email: p.email,
                        firstName: p.given_name,
                        secondName: p.family_name,
                        roles: p.roles || [],
                        token: keycloakInstance.token!,
                      };
                      setUser(userData);
                      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
                    }
                  }
                }
              } catch (error) {
                console.log("Delayed token refresh failed:", error);
              }
            }, 500);
          }
        }

        console.log("🟦 [AuthProvider] Setting initialized = true, isLoading = false");
        setInitialized(true);
        setIsLoading(false);
        console.log("🟦 [AuthProvider] INIT COMPLETE - Final state:", {
          initialized: true,
          authenticated: isActuallyAuthenticated,
          isLoading: false,
          hasUser: !!user,
        });
      })
      .catch((err) => {
        console.error("🔴 [AuthProvider] Keycloak init error:", err);
        console.log("🔴 [AuthProvider] Setting initialized = true, isLoading = false (error state)");
        setInitialized(true);
        setIsLoading(false);
      });
  }, []);

  // ---------------- LOGIN ----------------
  const login = useCallback(() => {
    console.log("🔵 [AuthProvider] login() called");
    const basePath = import.meta.env.BASE_URL || "/backoffice";
    const redirectUri = window.location.origin + basePath;
    console.log("🔵 [AuthProvider] Redirecting to Keycloak login:", redirectUri);
    keycloakInstance.login({
      redirectUri: redirectUri,
    });
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    const basePath = import.meta.env.BASE_URL || "/backoffice";

    // очищаем локальные данные
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);

    console.log(window.location.origin + basePath + '/logout')
    // полный SSO logout
    keycloakInstance.logout({
      redirectUri: window.location.origin + basePath + '/logout',
    });    
  }, []);

  // Отслеживание изменений состояний
  useEffect(() => {
    console.log("🔄 [AuthProvider] State changed:", {
      initialized,
      authenticated,
      isLoading,
      hasUser: !!user,
      userId: user?.id,
    });
  }, [initialized, authenticated, isLoading, user]);

  const value: AuthContextType = {
    keycloak: keycloakInstance,
    initialized,
    authenticated,
    isLoading,
    user,
    login,
    logout,
  };

  console.log("📦 [AuthProvider] Providing context value:", {
    initialized: value.initialized,
    authenticated: value.authenticated,
    isLoading: value.isLoading,
    hasUser: !!value.user,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
