import type { AccountEibType } from "../../types/dictionary/accountType"
import type { AgentOperationUpsertPayload } from "../../types/dictionary/agentOperationType"
import type { AgentType } from "../../types/dictionary/agentType"
import type { CountryType, CountryUpdatePayload } from "../../types/dictionary/countryType"
import type { CurrencyType } from "../../types/dictionary/currencyType"
import type { SwiftType } from "../../types/dictionary/swiftType"
import type { TransactionType } from "../../types/dictionary/transactionType"
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
    },
    updateAgent(payload: AgentType) {
        return apiClient.put('/admin-backend/dictionary-service/api/v1/dictionary/agents', payload)
    },
    updateAgentOperation(payload: AgentOperationUpsertPayload) {
        return apiClient.put('/admin-backend/dictionary-service/api/v1/dictionary/agent-operation', payload)
    },
    createAgentOperation(payload: AgentOperationUpsertPayload) {
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/agent-operation', payload)
    },
    createAgent(payload: AgentType){
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/agents', payload)
    },
    createEibAccount(payload: AccountEibType) {
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/eib_account', payload)
    },
    updateEibAccount(payload: AccountEibType) {
        return apiClient.put('/admin-backend/dictionary-service/api/v1/dictionary/eib_account', payload)
    },
    updateSwift(payload: SwiftType) {
        return apiClient.put('/admin-backend/dictionary-service/api/v1/dictionary/swift', payload)
    },
    createSwift(payload: SwiftType) {
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/swift', payload)
    },
    createCurrency(payload: CurrencyType) {
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/currency', payload)
    },
    createTransactionType(payload: TransactionType) {
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/transaction_type', payload)
    },
    updateCountry(payload: CountryUpdatePayload) {
        return apiClient.put('/admin-backend/dictionary-service/api/v1/dictionary/country', payload)
    },
    importCountries(file: File) {
        const formData = new FormData();
        formData.append('countries', file);

        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/country/import', formData)
    },
    createCountry(payload: CountryType) {
        return apiClient.post('/admin-backend/dictionary-service/api/v1/dictionary/country', payload)
    },

}
