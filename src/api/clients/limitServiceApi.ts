import { apiClient } from "../axios/apiClient";
import type { AgentLimitType, LimitType } from "../../types/limit/limitType";

export const LimitServiceApi = {
    getLimits() {
        return apiClient.get('/admin-backend/transaction-limit-service/api/v1/limits')
    },
    updateLimit(payload: LimitType) {
        return apiClient.put('/admin-backend/transaction-limit-service/api/v1/limits', payload)
    },
    createLimit(payload: LimitType) {
        return apiClient.post('/admin-backend/transaction-limit-service/api/v1/limits', payload)
    },
    getAgentLimits() {
        return apiClient.get('/admin-backend/transaction-limit-service/api/v1/agent-limits')
    },
    updateAgentLimit(payload: AgentLimitType) {
        return apiClient.put('/admin-backend/transaction-limit-service/api/v1/agent-limits', payload)
    },
    createAgentLimit(payload: AgentLimitType) {
        return apiClient.post('/admin-backend/transaction-limit-service/api/v1/agent-limits', payload)
    },
    getLimitUsageByUserId(userId: string, sinceDate: string, statusList: string[]) {
        const params = new URLSearchParams({
            "sinceDate": sinceDate,
            "statusList": statusList.join(","),
        }).toString();
        return apiClient.get(`/admin-backend/transaction-limit-service/api/v1/limit-usage/user/${userId}?${params}`)
    }
}