import { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "antd";
import { AuthContext } from "./AuthContext";
import keycloakInstance, { ensureKeycloakInit } from "./keycloak";
import { keycloakService } from "./keycloakService";
import { ENV } from "../config/env";
import type { UserKeycloakType } from "../types/keycloak/userKeycloakType";
import type { Props } from "../types/propsType";
import type { AuthContextType } from "../types/keycloak/authContextType";
import type { Role } from "../types/roles";

/** Legacy key from older builds — cleared on boot, never written again. */
const LEGACY_USER_STORAGE_KEY = "kc_user";

const SESSION_CONFIRMATION_TIMEOUT_MS = ENV.SESSION_CONFIRMATION_TIMEOUT_MS;
const SESSION_CONFIRMATION_COUNTDOWN_SEC = Math.ceil(
  ENV.SESSION_CONFIRMATION_TIMEOUT_MS / 1000
);
const IDLE_THRESHOLD_MS = ENV.SESSION_IDLE_THRESHOLD_MS;

const getBasePath = () => {
  const rawBasePath = import.meta.env.BASE_URL || "/backoffice/";
  return (rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`).replace(
    /\/$/,
    ""
  );
};

const extractRoles = (tokenParsed: Record<string, unknown> | undefined): Role[] => {
  if (!tokenParsed) return [];

  const fromRoot = Array.isArray(tokenParsed.roles) ? tokenParsed.roles : [];
  const realmAccess = tokenParsed.realm_access as { roles?: unknown } | undefined;
  const fromRealm = Array.isArray(realmAccess?.roles) ? realmAccess.roles : [];

  return [...new Set([...fromRoot, ...fromRealm])] as Role[];
};

const buildUserFromKeycloak = (): UserKeycloakType | null => {
  if (!keycloakInstance.token || !keycloakInstance.tokenParsed) return null;

  const p = keycloakInstance.tokenParsed as Record<string, unknown> & {
    sub?: string;
    name?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
  };

  return {
    id: p.sub ?? "",
    name: p.name ?? "",
    email: p.email,
    firstName: p.given_name,
    secondName: p.family_name,
    roles: extractRoles(p),
    // Tokens stay in memory only (React state + keycloak-js instance).
    token: keycloakInstance.token,
    refreshToken: keycloakInstance.refreshToken || undefined,
    idToken: keycloakInstance.idToken || undefined,
    timeSkew: keycloakInstance.timeSkew ?? undefined,
  };
};

export default function AuthProvider({ children }: Props) {
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
  const [user, setUser] = useState<UserKeycloakType | null>(null);

  const saveUserFromToken = useCallback(() => {
    const userData = buildUserFromKeycloak();
    if (!userData) return;
    setAuthenticated(true);
    setUser(userData);
  }, []);

  const clearAuthState = useCallback(() => {
    setAuthenticated(false);
    setUser(null);
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

  const closeSessionModal = useCallback(
    (result: boolean) => {
      setIsSessionModalOpen(false);
      clearSessionModalTimers();
      const resolver = sessionModalResolverRef.current;
      sessionModalResolverRef.current = null;
      resolver?.(result);
    },
    [clearSessionModalTimers]
  );

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
      closeSessionModal(false);
    }, SESSION_CONFIRMATION_TIMEOUT_MS);

    return new Promise<boolean>((resolve) => {
      sessionModalResolverRef.current = resolve;
    });
  }, [clearSessionModalTimers, closeSessionModal]);

  const forceLogout = useCallback(() => {
    clearAuthState();
    logoutRef.current();
  }, [clearAuthState]);

  const refreshWithPossibleConfirmation = useCallback(
    async (reason: "interval" | "expired"): Promise<void> => {
      const token = await keycloakService.refreshAccessToken(false);
      if (token) {
        saveUserFromToken();
        return;
      }

      // Idle user: ask before forcing refresh / logout.
      if (keycloakInstance.refreshToken && isIdleRef.current) {
        const confirmedToken = await keycloakService.refreshAccessToken(true);
        if (confirmedToken) {
          saveUserFromToken();
          return;
        }
      }

      void reason;
      forceLogout();
    },
    [forceLogout, saveUserFromToken]
  );

  // ---------------- INIT ----------------
  useEffect(() => {
    let cancelled = false;

    try {
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    } catch {
      // ignore
    }

    const basePath = getBasePath();
    const redirectUri = `${window.location.origin}${basePath}`;

    keycloakInstance.onAuthSuccess = () => {
      saveUserFromToken();
    };

    keycloakInstance.onAuthError = () => {
      clearAuthState();
    };

    keycloakInstance.onAuthRefreshSuccess = () => {
      saveUserFromToken();
    };

    keycloakInstance.onAuthRefreshError = () => {
      console.error("[AuthProvider] onAuthRefreshError");
      forceLogout();
    };

    keycloakInstance.onTokenExpired = () => {
      refreshWithPossibleConfirmation("expired");
    };

    // Cross-subdomain (app*.eib.kg ↔ key.eib.kg): silent iframe SSO is blocked by
    // 3rd-party cookies / CSP. Without silentCheckSsoRedirectUri, check-sso does a
    // full-page redirect with prompt=none (brief hop to Keycloak if SSO is alive).
    // ensureKeycloakInit() is module-scoped so React Strict Mode cannot double-init.
    ensureKeycloakInit({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
      silentCheckSsoFallback: true,
      redirectUri,
    })
      .then((auth) => {
        if (cancelled) return;

        const isActuallyAuthenticated = Boolean(
          auth && keycloakInstance.token && keycloakInstance.tokenParsed
        );

        if (isActuallyAuthenticated) {
          saveUserFromToken();
        } else {
          clearAuthState();
        }

        setInitialized(true);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[AuthProvider] Keycloak init error:", err);
        clearAuthState();
        setInitialized(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clearAuthState, forceLogout, refreshWithPossibleConfirmation, saveUserFromToken]);

  // ---------------- LOGIN ----------------
  const login = useCallback(() => {
    const basePath = getBasePath();
    keycloakInstance.login({
      redirectUri: `${window.location.origin}${basePath}`,
    });
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    const basePath = getBasePath();
    clearAuthState();

    keycloakInstance.logout({
      redirectUri: `${window.location.origin}${basePath}/logout`,
    });
  }, [clearAuthState]);

  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

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

  const value: AuthContextType = {
    keycloak: keycloakInstance,
    initialized,
    authenticated,
    isLoading,
    user,
    login,
    logout,
  };

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
