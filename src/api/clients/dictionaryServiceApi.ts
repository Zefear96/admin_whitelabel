import { apiClient } from "../axios/apiClient"

export const DictionaryServiceApi = {
    getBankAgents() {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a7fd64bb483ae3b2a2690d4dbfe159a7ac41b6e4
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
<<<<<<< HEAD
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
=======
>>>>>>> a7fd64bb483ae3b2a2690d4dbfe159a7ac41b6e4
    },
    getAgentOperations(agent:string, isActive?:string) {
        const params = new URLSearchParams({
            agent,
        });

        if (isActive !== undefined) {
            params.append("isActive", isActive);
        }

<<<<<<< HEAD
<<<<<<< HEAD
        return apiClient.get(`/admin-backend/dictionary-service/api/v1/dictionary/agent-operation/search?${params.toString()}`)
=======
        return apiClient.get(`/admin-backend/dictionary/api/v1/dictionary/agent-operation/search?${params.toString()}`)
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
=======
        return apiClient.get(`/admin-backend/dictionary-service/api/v1/dictionary/agent-operation/search?${params.toString()}`)
>>>>>>> a7fd64bb483ae3b2a2690d4dbfe159a7ac41b6e4
    }

}
