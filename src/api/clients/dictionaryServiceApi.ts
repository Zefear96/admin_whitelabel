import { apiClient } from "../axios/apiClient"

export const DictionaryServiceApi = {
    getBankAgents() {
<<<<<<< HEAD
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
=======
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/agents')
    }, 
    getCountries() {
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/country')
    },
    getCurrencies() {
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/currency')
    },
    getTransactionTypes() {
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/transaction_type')
    },
    getRiskLevels() {
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/risk-level')
    },
    getAccountEibList() {
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/eib_account')
    },
    getSwiftCodesList() {
        return apiClient.get('/admin-backend/dictionary/api/v1/dictionary/swift')
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
    },
    getAgentOperations(agent:string, isActive?:string) {
        const params = new URLSearchParams({
            agent,
        });

        if (isActive !== undefined) {
            params.append("isActive", isActive);
        }

<<<<<<< HEAD
        return apiClient.get(`/admin-backend/dictionary-service/api/v1/dictionary/agent-operation/search?${params.toString()}`)
=======
        return apiClient.get(`/admin-backend/dictionary/api/v1/dictionary/agent-operation/search?${params.toString()}`)
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
    }

}
