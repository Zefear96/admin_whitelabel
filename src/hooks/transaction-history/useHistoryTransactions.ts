import { useQuery } from "@tanstack/react-query";
import { HistoryTransactionsApi } from "../../api/clients/historyTransactionsApi";
import type { TransactionHistoryDataType } from "../../types/history/responseTransactionType";

export const useHistoryTransactions = (fromDate: string, toDate: string) => {
    return useQuery<TransactionHistoryDataType>({
        queryKey: ["history-transactions", fromDate, toDate],
        queryFn: () =>
            HistoryTransactionsApi.getAllHistoryTransactions(fromDate, toDate).then(
                (res) => res.data,
            ),
    });
};
