import { apiClient } from "../axios/apiClient"

export const BankingGatewayApi = {
    getAllIncomingTransactions(page?: number, size?: number, sort?: string, direction?: string) {
        const params = new URLSearchParams({
            page: page?.toString() ?? "0",
            size: size?.toString() ?? "20",
            sort: sort ?? "creationDate",
            direction: direction ?? "DESC",
        }).toString()
        return apiClient.get(`/admin-backend/banking-gateway/api/v1/transaction?${params.toString()}`)
    },
    getIncomingTransactionsByAgent(
        agent: string,
        page?: number,
        size?: number,
        sort?: string,
        direction?: string,
        creationDateMin?: string,
        creationDateMax?: string,
        status?: string,
    ) {
        const params = new URLSearchParams({
            page: page?.toString() ?? "0",
            size: size?.toString() ?? "20",
            sort: sort ?? "creationDate",
            direction: direction ?? "DESC",
        })

        // Empty filters are not applied on backend — do not send empty values.
        if (creationDateMin) {
            params.set("creationDateMin", creationDateMin)
        }
        if (creationDateMax) {
            params.set("creationDateMax", creationDateMax)
        }
        if (status) {
            params.set("status", status)
        }

        return apiClient.get(`/admin-backend/banking-gateway/api/v1/transaction/agent/${agent}?${params.toString()}`)
    }
}
