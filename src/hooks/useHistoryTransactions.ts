import { useQuery } from "@tanstack/react-query"
import { HistoryTransactionsApi } from "../api/clients/historyTransactionsApi"
import { historyTxMobileMock } from "../api/mock/historyTxMobile"

export const useHistoryTransactions = (fromDate: string, toDate: string) => {
    return useQuery({
        queryKey: ['history-transactions', fromDate, toDate],
        queryFn:
            // () => HistoryTransactionsApi.getAllHistoryTransactions(fromDate, toDate)
            //     .then(res => res.data),
            async () => {
                const data = historyTxMobileMock;
                return data;
            }
           
        // enabled: !!fromDate && !!toDate
    })
}