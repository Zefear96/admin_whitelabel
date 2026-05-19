import { useQuery } from "@tanstack/react-query";
import { HistoryTransactionsApi } from "../../api/clients/historyTransactionsApi";
import type { TransactionHistoryDataType } from "../../types/transaction-history/transactionHistoryDataType";

export const useHistoryTransactions = (fromDate: string, toDate: string) => {
    return useQuery<TransactionHistoryDataType>({
        queryKey: ["history-transactions", fromDate, toDate],
        queryFn: () =>
            HistoryTransactionsApi.getAllHistoryTransactions(fromDate, toDate).then(
                (res) => res.data,
            ),
    });
};
