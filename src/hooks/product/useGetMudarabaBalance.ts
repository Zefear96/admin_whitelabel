import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { MudarabaBalanceDataType } from "../../types/product/MudarabaDataType";
import type { AxiosError } from "axios";

export const useGetMudarabaBalance = (mudarabaNumber: string | undefined) => {
  return useQuery<MudarabaBalanceDataType, AxiosError>({
    queryKey: ["product", "mudaraba-balance", mudarabaNumber],
    queryFn: async() => {
      return await ProductServiceApi.getMudarabaBalance(mudarabaNumber!).then(response => response.data)
  },
  refetchOnMount: 'always',
  enabled: !!mudarabaNumber,
})
};

