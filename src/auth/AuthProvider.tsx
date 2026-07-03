import { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "antd";
import { AuthContext } from "./AuthContext";
import keycloakInstance from "./keycloak";
import { keycloakService } from "./keycloakService";
import { ENV } from "../config/env";
import type { UserKeycloakType } from "../types/keycloak/userKeycloakType";
import type { Props } from "../types/propsType";
import type { AuthContextType } from "../types/keycloak/authContextType";

const USER_STORAGE_KEY = "kc_user";
const SESSION_CONFIRMATION_TIMEOUT_MS = ENV.SESSION_CONFIRMATION_TIMEOUT_MS;
const SESSION_CONFIRMATION_COUNTDOWN_SEC = Math.ceil(
  ENV.SESSION_CONFIRMATION_TIMEOUT_MS / 1000
);
const IDLE_THRESHOLD_MS = ENV.SESSION_IDLE_THRESHOLD_MS;

export default function AuthProvider({ children }: Props) {
  const isRun = useRef(false);
  const logoutRef = useRef<() => void>(() => {});
  const sessionModalResolverRef = useRef<((result: boolean) => void) | null>(null);
  const sessionModalTimeoutRef = useRef<number | null>(null);
  const sessionModalIntervalRef = useRef<number | null>(null);

  const lastActivityAtRef = useRef<number>(Date.now());
  const isIdleRef = useRef<boolean>(false);

  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionCountdownSec, setSessionCountdownSec] = useState<number>(
    SESSION_CONFIRMATION_COUNTDOWN_SEC
  );

  const [user, setUser] = useState<UserKeycloakType | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserKeycloakType) : null;
    } catch {
      return null;
    }
  });

  const saveUserFromToken = useCallback(() => {
    if (!keycloakInstance.tokenParsed || !keycloakInstance.token) return;

    const p: any = keycloakInstance.tokenParsed;
    const userData: UserKeycloakType = {
      id: p.sub,
      name: p.name,
      email: p.email,
      firstName: p.given_name,
      secondName: p.family_name,
      roles: p.roles || [],
      token: keycloakInstance.token,
      refreshToken: keycloakInstance.refreshToken || undefined,
      idToken: keycloakInstance.idToken || undefined,
      timeSkew: keycloakInstance.timeSkew ?? undefined,
    };

    setAuthenticated(true);
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  // ---------------- IDLE TRACKING ----------------
  useEffect(() => {
    const markActivity = () => {
      lastActivityAtRef.current = Date.now();
      isIdleRef.current = false;
    };

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "focus",
    ];

    events.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));

    const intervalId = window.setInterval(() => {
      isIdleRef.current = Date.now() - lastActivityAtRef.current > IDLE_THRESHOLD_MS;
    }, 5_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActivity));
      window.clearInterval(intervalId);
    };
  }, []);

  const clearSessionModalTimers = useCallback(() => {
    if (sessionModalTimeoutRef.current != null) {
      window.clearTimeout(sessionModalTimeoutRef.current);
      sessionModalTimeoutRef.current = null;
    }
    if (sessionModalIntervalRef.current != null) {
      window.clearInterval(sessionModalIntervalRef.current);
      sessionModalIntervalRef.current = null;
    }
  }, []);

  const requestSessionContinuation = useCallback(async (): Promise<boolean> => {
    if (sessionModalResolverRef.current) {
      return new Promise<boolean>((resolve) => {
        const prevResolver = sessionModalResolverRef.current;
        sessionModalResolverRef.current = (result) => {
          prevResolver?.(result);
          resolve(result);
        };
      });
    }

    setIsSessionModalOpen(true);
    setSessionCountdownSec(SESSION_CONFIRMATION_COUNTDOWN_SEC);
    clearSessionModalTimers();

    sessionModalIntervalRef.current = window.setInterval(() => {
      setSessionCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1_000);

    sessionModalTimeoutRef.current = window.setTimeout(() => {
      // no confirmation in time -> treat as отказ and logout will happen upstream
      closeSessionModal(false);
    }, SESSION_CONFIRMATION_TIMEOUT_MS);

    return new Promise<boolean>((resolve) => {
      sessionModalResolverRef.current = resolve;
    });
  }, [clearSessionModalTimers]);

  const closeSessionModal = useCallback((result: boolean) => {
    setIsSessionModalOpen(false);
    clearSessionModalTimers();
    const resolver = sessionModalResolverRef.current;
    sessionModalResolverRef.current = null;
    resolver?.(result);
  }, [clearSessionModalTimers]);

  const forceLogout = useCallback(() => {
    setAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    logoutRef.current();
  }, []);

  const refreshWithPossibleConfirmation = useCallback(
    async (reason: "interval" | "expired"): Promise<void> => {
      const token = await keycloakService.refreshAccessToken(false);
      if (token) {
        saveUserFromToken();
        return;
      }

      // Если есть refreshToken, но клиент не активен — спрашиваем подтверждение.
      // Если не подтвердил за 15 сек -> refreshAccessToken(true) вернёт null -> разлогиниваем.
      if (keycloakInstance.refreshToken && isIdleRef.current) {
        const confirmedToken = await keycloakService.refreshAccessToken(true);
        if (confirmedToken) {
          saveUserFromToken();
          return;
        }
      }

      // Если refresh невозможен/неуспешен — завершаем сессию.
      // (reason оставлен для возможной диагностики, но сейчас не логируем)
      void reason;
      forceLogout();
    },
    [forceLogout, saveUserFromToken]
  );

  // ---------------- INIT ----------------
  useEffect(() => {
    // console.log("🔵 [AuthProvider] INIT START - useEffect triggered");
    // console.log("🔵 [AuthProvider] Initial state:", {
    //   initialized,
    //   authenticated,
    //   isLoading,
    //   hasUser: !!user,
    //   userFromStorage: localStorage.getItem(USER_STORAGE_KEY) ? "exists" : "not found",
    // });

    if (isRun.current) {
      // console.log("🔵 [AuthProvider] Already initialized, skipping");
      return;
    }
    isRun.current = true;

    // Нормализуем basePath: гарантируем ведущий "/" и убираем последний "/"
    const rawBasePath = import.meta.env.BASE_URL || "/backoffice/";
    const basePath =
      (rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`).replace(
        /\/$/,
        ""
      );
    const silentCheckSsoUri =
      window.location.origin + basePath + "/silent-check-sso.html";
    
    // console.log("🔵 [AuthProvider] Keycloak config:", {
    //   basePath,
    //   silentCheckSsoUri,
    //   keycloakUrl: keycloakInstance.authServerUrl,
    //   realm: keycloakInstance.realm,
    //   clientId: keycloakInstance.clientId,
    // });

    // Обработчики событий Keycloak
    keycloakInstance.onAuthSuccess = () => {
      // console.log("🟢 [AuthProvider] onAuthSuccess triggered (event handler)");
      // console.log("🟢 [AuthProvider] Keycloak state in onAuthSuccess:", {
      //   authenticated: keycloakInstance.authenticated,
      //   hasToken: !!keycloakInstance.token,
      //   hasTokenParsed: !!keycloakInstance.tokenParsed,
      //   tokenLength: keycloakInstance.token?.length || 0,
      // });
      if (keycloakInstance.authenticated && keycloakInstance.tokenParsed) {
        // console.log("🟢 [AuthProvider] onAuthSuccess: Setting authenticated = true");
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
          refreshToken: keycloakInstance.refreshToken || undefined,
          idToken: keycloakInstance.idToken || undefined,
          timeSkew: keycloakInstance.timeSkew ?? undefined,
        };
        // console.log("🟢 [AuthProvider] onAuthSuccess: Saving user to localStorage:", {
        //   id: userData.id,
        //   name: userData.name,
        //   email: userData.email,
        // });
        setUser(userData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        // console.log("🟢 [AuthProvider] onAuthSuccess: User saved successfully");
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

    keycloakInstance.onAuthRefreshSuccess = () => {
      saveUserFromToken();
    };

    keycloakInstance.onAuthRefreshError = () => {
      console.error("[AuthProvider] onAuthRefreshError");
    };

    keycloakInstance.onTokenExpired = () => {
      refreshWithPossibleConfirmation("expired");
    };

    // Пытаемся восстановить сессию из localStorage, передавая токены в init,
    // как описано в документации Keycloak (options: token, refreshToken, idToken, timeSkew)
    const initOptions: any = {
      onLoad: "login-required",
      pkceMethod: "S256",
      checkLoginIframe: false, // Отключаем iframe проверку, чтобы избежать проблем с асинхронностью
      // silentCheckSsoRedirectUri: `${window.location.origin}${basePath}/silent-check-sso.html`,
      redirectUri: window.location.origin + basePath,
    };

    if (user?.token) {
      initOptions.token = user.token;
    }
    if (user?.refreshToken) {
      initOptions.refreshToken = user.refreshToken;
    }
    if (user?.idToken) {
      initOptions.idToken = user.idToken;
    }
    if (typeof user?.timeSkew === "number") {
      initOptions.timeSkew = user.timeSkew;
    }

    // console.log("🔵 [AuthProvider] Keycloak init options with persisted tokens:", {
    //   hasUserInState: !!user,
    //   hasToken: !!user?.token,
    //   hasRefreshToken: !!user?.refreshToken,
    //   hasIdToken: !!user?.idToken,
    //   timeSkew: user?.timeSkew,
    // });

    keycloakInstance
      .init(initOptions)
      .then(async (auth) => {
        // console.log("🟦 [AuthProvider] Keycloak init() completed");
        // console.log("🟦 [AuthProvider] Init result:", {
        //   auth,
        //   authenticated: keycloakInstance.authenticated,
        //   hasToken: !!keycloakInstance.token,
        //   tokenLength: keycloakInstance.token?.length || 0,
        //   hasRefreshToken: !!keycloakInstance.refreshToken,
        //   refreshTokenLength: keycloakInstance.refreshToken?.length || 0,
        //   hasTokenParsed: !!keycloakInstance.tokenParsed,
        //   tokenParsed: keycloakInstance.tokenParsed ? {
        //     sub: keycloakInstance.tokenParsed.sub,
        //     name: (keycloakInstance.tokenParsed as any).name,
        //     email: (keycloakInstance.tokenParsed as any).email,
        //   } : null,
        // });

        // Если есть токен, но auth === false, это может быть из-за асинхронности iframe
        // Проверяем наличие токена напрямую
        if (!auth && keycloakInstance.token && keycloakInstance.tokenParsed) {
          // console.log("🟨 [AuthProvider] Token exists but auth is false, treating as authenticated");
          const isActuallyAuthenticated = true;
          // console.log("🟨 [AuthProvider] Setting authenticated = true (token found)");
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
            refreshToken: keycloakInstance.refreshToken || undefined,
            idToken: keycloakInstance.idToken || undefined,
            timeSkew: keycloakInstance.timeSkew ?? undefined,
          };
          // console.log("🟨 [AuthProvider] Saving user to localStorage:", userData);
          setUser(userData);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
          
          // console.log("🟨 [AuthProvider] Setting initialized = true, isLoading = false");
          setInitialized(true);
          setIsLoading(false);
          // console.log("🟨 [AuthProvider] Early return - user authenticated via token");
          return;
        }

        // Если check-sso не нашел сессию, но есть refreshToken, попробуем обновить токен
        if (!auth && keycloakInstance.refreshToken) {
          // console.log("🟡 [AuthProvider] check-sso returned false, but refreshToken exists");
          // console.log("🟡 [AuthProvider] Attempting token refresh...");
          try {
            const refreshed = await keycloakInstance.updateToken(60);
            console.log("Token refresh result:", {
              refreshed,
              authenticated: keycloakInstance.authenticated,
              hasToken: !!keycloakInstance.token,
            });
            
            if (refreshed && keycloakInstance.authenticated) {
              // Токен успешно обновлен, пользователь аутентифицирован
              // console.log("🟢 [AuthProvider] Token refreshed successfully!");
              // console.log("🟢 [AuthProvider] Setting authenticated = true");
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
                  refreshToken: keycloakInstance.refreshToken || undefined,
                  idToken: keycloakInstance.idToken || undefined,
                  timeSkew: keycloakInstance.timeSkew ?? undefined,
                };

                setUser(userData);
                localStorage.setItem(
                  USER_STORAGE_KEY,
                  JSON.stringify(userData)
                );
              }
              
              // console.log("🟢 [AuthProvider] Setting initialized = true, isLoading = false");
              setInitialized(true);
              setIsLoading(false);
              // console.log("🟢 [AuthProvider] Early return - user authenticated via refresh");
              return;
            } else {
              console.log("🟡 [AuthProvider] Token refresh returned false or not authenticated");
            }
          } catch (error) {
            console.error("🔴 [AuthProvider] Token refresh failed, user needs to login:", error);
            // Очищаем устаревшие данные
            // console.log("🔴 [AuthProvider] Clearing localStorage and user state");
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          }
        }

        // Если auth === true, но authenticated может быть еще false из-за асинхронности
        // Проверяем актуальное состояние keycloakInstance
        const isActuallyAuthenticated = auth || keycloakInstance.authenticated;
        // console.log("🟦 [AuthProvider] Final authentication check:", {
        //   auth,
        //   keycloakAuthenticated: keycloakInstance.authenticated,
        //   isActuallyAuthenticated,
        // });
        // console.log("🟦 [AuthProvider] Setting authenticated =", isActuallyAuthenticated);
        setAuthenticated(isActuallyAuthenticated);

        if (isActuallyAuthenticated && keycloakInstance.tokenParsed) {
          // console.log("🟢 [AuthProvider] User is authenticated, saving user data");
          const p: any = keycloakInstance.tokenParsed;

          const userData: UserKeycloakType = {
            id: p.sub,
            name: p.name,
            email: p.email,
            firstName: p.given_name,
            secondName: p.family_name,
            roles: p.roles || [],
            token: keycloakInstance.token!, // можно убрать, если не нужен
            refreshToken: keycloakInstance.refreshToken || undefined,
            idToken: keycloakInstance.idToken || undefined,
            timeSkew: keycloakInstance.timeSkew ?? undefined,
          };

          // console.log("🟢 [AuthProvider] User data:", userData);
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
                  const refreshed = await keycloakInstance.updateToken(60);
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
                        refreshToken: keycloakInstance.refreshToken || undefined,
                        idToken: keycloakInstance.idToken || undefined,
                        timeSkew: keycloakInstance.timeSkew ?? undefined,
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

        // console.log("🟦 [AuthProvider] Setting initialized = true, isLoading = false");
        setInitialized(true);
        setIsLoading(false);
        // console.log("🟦 [AuthProvider] INIT COMPLETE - Final state:", {
        //   initialized: true,
        //   authenticated: isActuallyAuthenticated,
        //   isLoading: false,
        //   hasUser: !!user,
        // });
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
    // console.log("🔵 [AuthProvider] login() called");
    const rawBasePath = import.meta.env.BASE_URL || "/backoffice/";
    const basePath =
      (rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`).replace(
        /\/$/,
        ""
      );
    const redirectUri = window.location.origin + basePath;
    // console.log("🔵 [AuthProvider] Redirecting to Keycloak login:", redirectUri);
    keycloakInstance.login({
      redirectUri: redirectUri,
    });
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    const rawBasePath = import.meta.env.BASE_URL || "/backoffice/";
    const basePath =
      (rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`).replace(
        /\/$/,
        ""
      );

    // очищаем локальные данные
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);

    // console.log(window.location.origin + basePath + '/logout')
    // полный SSO logout
    keycloakInstance.logout({
      redirectUri: window.location.origin + basePath + '/logout',
    });    
  }, []);

  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  // Проактивное обновление access-токена (живёт ~2 мин, refresh — год)
  useEffect(() => {
    if (!authenticated || !initialized) return;

    const refreshIntervalMs = 55_000;

    const intervalId = window.setInterval(() => {
      refreshWithPossibleConfirmation("interval");
    }, refreshIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [authenticated, initialized, refreshWithPossibleConfirmation]);

  useEffect(() => {
    keycloakService.setSessionContinuationHandler(requestSessionContinuation);
    return () => {
      keycloakService.setSessionContinuationHandler(null);
    };
  }, [requestSessionContinuation]);

  // Отслеживание изменений состояний
  // useEffect(() => {
  //   console.log("🔄 [AuthProvider] State changed:", {
  //     initialized,
  //     authenticated,
  //     isLoading,
  //     hasUser: !!user,
  //     userId: user?.id,
  //   });
  // }, [initialized, authenticated, isLoading, user]);

  const value: AuthContextType = {
    keycloak: keycloakInstance,
    initialized,
    authenticated,
    isLoading,
    user,
    login,
    logout,
  };

  // console.log("📦 [AuthProvider] Providing context value:", {
  //   initialized: value.initialized,
  //   authenticated: value.authenticated,
  //   isLoading: value.isLoading,
  //   hasUser: !!value.user,
  // });

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Modal
        open={isSessionModalOpen}
        title="Сессия истекла"
        closable={false}
        maskClosable={false}
        onCancel={() => closeSessionModal(false)}
        okText="Продолжить работу"
        cancelText="Выйти"
        onOk={() => closeSessionModal(true)}
      >
        Время сессии истекло. Продолжить работу и обновить токен? Автовыход через{" "}
        <b>{sessionCountdownSec}</b> сек.
      </Modal>
    </AuthContext.Provider>
  );
}
