import keycloakInstance from "./keycloak";

type SessionContinuationHandler = () => Promise<boolean>;

/** Обновляем access-токен, если до истечения осталось меньше minValidity секунд */
const TOKEN_MIN_VALIDITY_SEC = 60;

let refreshPromise: Promise<string | null> | null = null;
let continuationHandler: SessionContinuationHandler | null = null;

const setSessionContinuationHandler = (handler: SessionContinuationHandler | null) => {
    continuationHandler = handler;
};

const canRefreshToken = (): boolean => !!keycloakInstance.refreshToken;

const refreshAccessToken = async (withConfirmation = false): Promise<string | null> => {
    if (!canRefreshToken()) return null;
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            await keycloakInstance.updateToken(TOKEN_MIN_VALIDITY_SEC);
            return keycloakInstance.token || null;
        } catch (err) {
            if (!withConfirmation || !continuationHandler) {
                console.error("Failed to refresh access token:", err);
                return null;
            }

            const isApproved = await continuationHandler();
            if (!isApproved) return null;

            try {
                await keycloakInstance.updateToken(-1);
                return keycloakInstance.token || null;
            } catch (refreshErr) {
                console.error("Failed to refresh access token after confirmation:", refreshErr);
                return null;
            }
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

// Возвращаем актуальный токен. Обновляет его при необходимости.
const getAccessToken = async (): Promise<string | null> => {
    if (!keycloakInstance.token && !canRefreshToken()) return null;
    if (!canRefreshToken()) return keycloakInstance.token || null;
    return refreshAccessToken(false);
};

export const keycloakService = {
    setSessionContinuationHandler,
    refreshAccessToken,
    getAccessToken,
};
