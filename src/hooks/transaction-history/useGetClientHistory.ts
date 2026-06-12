import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { HistoryTransactionsApi } from "../../api/clients/historyTransactionsApi";
import type { TransactionHistoryDataType } from "../../types/transaction-history/transactionHistoryDataType";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const useGetClientHistory = (
  keycloakClientId: string | undefined,
  fromDate: string | undefined,
  toDate: string | undefined,
  page = 0,
  size = 30,
) => {
  const today = formatDate(new Date());
  const safeToDate = toDate ?? today;
  const safeFromDate = fromDate ?? today;

  return useQuery<TransactionHistoryDataType, AxiosError>({
    queryKey: ["history", "client-history", keycloakClientId, safeFromDate, safeToDate, page, size],
    queryFn: async () => {
      const response = await HistoryTransactionsApi.getClientHistory(
        keycloakClientId!,
        safeFromDate,
        safeToDate,
        page,
        size,
      );
      return response.data;
    },
    refetchOnMount: "always",
    enabled: !!keycloakClientId,
  });
};
