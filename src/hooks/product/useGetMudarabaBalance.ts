import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { ResponseMudarabaBalanceType } from "../../types/product/responseMudarabaType";
import type { AxiosError } from "axios";

export const useGetMudarabaBalance = (mudarabaNumber: string | undefined) => {
  return useQuery<ResponseMudarabaBalanceType, AxiosError>({
    queryKey: ["product", "mudaraba-balance", mudarabaNumber],
    queryFn: async() => {
      return await ProductServiceApi.getMudarabaBalance(mudarabaNumber!).then(response => response.data)
  },
  refetchOnMount: 'always',
  enabled: !!mudarabaNumber,
})
};

