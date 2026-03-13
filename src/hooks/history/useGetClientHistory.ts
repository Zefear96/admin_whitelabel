import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { ResponseMurabahaBalanceType } from "../../types/product/responseMurabahaType";
import type { AxiosError } from "axios";
import { HistoryTransactionsApi } from "../../api/clients/historyTransactionsApi";

export const useGetClientHistory = (clientId: string | undefined, fromDate: string | undefined, toDate: string | undefined) => {
  return useQuery<ResponseMurabahaBalanceType, AxiosError>({
    queryKey: ["history", "client-history", clientId],
    queryFn: async() => {
      return await HistoryTransactionsApi.getClientHistory(clientId!, fromDate!, toDate!).then(response => response.data)
  },
  refetchOnMount: 'always',
})
};

