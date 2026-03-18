import { apiClient } from "../axios/apiClient"

export const registryAiylServiceApi = {
    getOutgoingTransactionsAyil(agent: string, from?: string, to?: string, page = 0, size = 20) {
        const params = new URLSearchParams({
            "agent": agent,
            "from": from ?? "",
            "to": to ?? "",
            "page": String(page),
            "size": String(size),
        });

        return apiClient.get(`/admin-backend/aiyl-bank-service/api/v1/banks/internal/aiyl/agents/payments?${params.toString()}`)
    }
}
