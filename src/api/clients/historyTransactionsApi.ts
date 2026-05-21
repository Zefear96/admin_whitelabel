import {apiClient} from "../axios/apiClient";

export const HistoryTransactionsApi = {
    getAllHistoryTransactions(fromDate: string, toDate: string) {
        return apiClient.get('/api/history', {
            params: {
                fromDate,
                toDate
            }
        });
    },
    getClientHistory(keycloakClientId: string, fromDate: string, toDate: string, page: number, size: number) {
        const params = new URLSearchParams({
            fromDate,
            toDate,
            userId: keycloakClientId,
            sort: "createdAt,DESC",
            page: page.toString(),
            size: size.toString(),
        });

        return apiClient.get(`/admin-backend/transaction-history-service/api/history?${params.toString()}`)
    },
};
