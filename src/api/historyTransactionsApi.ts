import {apiClient} from "./axios";

export const historyTransactionsApi = {
    getAllHistoryTransactions(fromDate: string, toDate: string) {
        return apiClient.get('/api/history', {
            params: {
                fromDate,
                toDate
            }
        });
    },
};
