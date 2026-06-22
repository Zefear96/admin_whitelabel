import { apiClient } from "../axios/apiClient"

export const ProductServiceApi = {
    getCards(keycloakClientId: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/bank-cards?userId=${keycloakClientId}`)
    },
    getAccounts(keycloakClientId: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/bank-accounts?userId=${keycloakClientId}`)
    },
    getMudaraba(keycloakClientId: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/mudarabahs?userId=${keycloakClientId}`)
    },
    getSafe(keycloakClientId: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/safe-deposit-boxes?userId=${keycloakClientId}`)
    },
    /////////////////////// status ///////////////////////
    getCardBalance(cardId: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/bank-cards/${cardId}/balance`)
    },
    getAccountBalance(accountNumber: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/bank-accounts/status/by-account-number/${accountNumber}`)
    },
    getMudarabaBalance(mudarabaNumber: string) {
        return apiClient.get(`/admin-backend/product-service/api/v1/mudarabahs/status/by-account-number/${mudarabaNumber}`)
    },
}