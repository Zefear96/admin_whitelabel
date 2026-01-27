import { apiClient } from "../axios/apiClient"

export const DictionaryServiceApi = {
    getBankAgents() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/agents')
    }, 
    getCountries() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/country')
    },
    getCurrencies() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/currency')
    },
    getTransactionTypes() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/transaction_type')
    },
    getRiskLevels() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/risk-level')
    },
    getAccountEibList() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/eib_account')
    },
    getSwiftCodesList() {
        return apiClient.get('/admin-backend/dictionary-service/api/v1/dictionary/swift')
    },
    getAgentOperations(agent:string, isActive?:string) {
        const params = new URLSearchParams({
            agent,
        });

        if (isActive !== undefined) {
            params.append("isActive", isActive);
        }

        return apiClient.get(`/admin-backend/dictionary-service/api/v1/dictionary/agent-operation/search?${params.toString()}`)
    }

}
