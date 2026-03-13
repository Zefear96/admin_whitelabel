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
    getClientHistory(clientId: string, fromDate: string, toDate: string) {
        const params = new URLSearchParams({
            clientId,
            fromDate,
            toDate
        });
        return apiClient.get(`/admin-backend/transaction-history-service/api/history?${params.toString()}`, {
        });
    },
};
