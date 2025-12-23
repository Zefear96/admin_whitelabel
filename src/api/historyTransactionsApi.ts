import {apiClient} from "./axios";

export const HistoryTransactionsApi = {
    getAllHistoryTransactions(fromDate: string, toDate: string) {
        return apiClient.get('/api/history', {
            params: {
                fromDate,
                toDate
            }
        });
    },
};
