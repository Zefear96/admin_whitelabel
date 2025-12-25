import keycloakInstance from "./keycloak";

export const keycloakService = {

    // Возвращаем актуальный токен. Обновляет его при необходимости.
    getAccessToken: async (): Promise<string | null> => {
        try {
            if (!keycloakInstance.authenticated) return null;

            // Обновляем токен, если срок действия < 30 сек
            await keycloakInstance.updateToken(30);

            return keycloakInstance.token || null;
        } catch (err) {
            console.error("Failed to get access token:", err);
            return null;
        }
    },
};
