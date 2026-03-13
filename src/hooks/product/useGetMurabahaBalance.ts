import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { ResponseMurabahaBalanceType } from "../../types/product/responseMurabahaType";
import type { AxiosError } from "axios";

export const useGetMurabahaBalance = (murabahaId: string | undefined) => {
  return useQuery<ResponseMurabahaBalanceType, AxiosError>({
    queryKey: ["product", "murabaha-balance", murabahaId],
    queryFn: async() => {
      return await ProductServiceApi.getMurabahaBalance(murabahaId!).then(response => response.data)
  },
  refetchOnMount: 'always',
})
};

