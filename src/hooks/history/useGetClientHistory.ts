import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { HistoryTransactionsApi } from "../../api/clients/historyTransactionsApi";
import type { ResponseTransactionType } from "../../types/history/responseTransactionType";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const useGetClientHistory = (
  keycloakClientId: string | undefined,
  fromDate: string | undefined,
  toDate: string | undefined,
) => {
  const today = formatDate(new Date());
  const safeToDate = toDate ?? today;
  const safeFromDate = fromDate ?? today;

  return useQuery<ResponseTransactionType[], AxiosError>({
    queryKey: ["history", "client-history", keycloakClientId, safeFromDate, safeToDate],
    queryFn: async () => {
      return await HistoryTransactionsApi.getClientHistory(keycloakClientId!, safeFromDate, safeToDate).then(
        (response) => response.data,
      );
    },
    refetchOnMount: "always",
    enabled: !!keycloakClientId,
  });
};

