import { useQuery } from "@tanstack/react-query"
import { HistoryTransactionsApi } from "../api/historyTransactionsApi"

export const useHistoryTransactions = (fromDate:string, toDate: string) => {
    return useQuery({
        queryKey: ['history-transactions', fromDate, toDate],
        queryFn: () => HistoryTransactionsApi.getAllHistoryTransactions(fromDate, toDate)
        .then(res => res.data),
        enabled: !!fromDate && !!toDate
    })
}