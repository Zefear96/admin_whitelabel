import { apiClient } from "../axios/apiClient"
import { historyTx } from "../mock/historyTx";

export const TransactionsBankHistoryAnalyticsApi = {
    getAnalyticsTransactionsBankApi(code: string, fromDate?:string, toDate?:string) {
        const params = new URLSearchParams();
        params.append("code", code);
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);
        console.log("Request URL:", `/api/analytics/reports/bank-payments?${params.toString()}`);

        // return apiClient.get(`/api/analytics/reports/bank-payments?${params.toString()}`)
        console.log({historyTx});
        const data = historyTx;
        return data;
    }
}
