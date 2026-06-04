import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { MurabahaBalanceDataType } from "../../types/product/MurabahaDataType";
import type { AxiosError } from "axios";

export const useGetMurabahaBalance = (murabahaId: string | undefined) => {
  return useQuery<MurabahaBalanceDataType, AxiosError>({
    queryKey: ["product", "murabaha-balance", murabahaId],
    queryFn: async() => {
      return await ProductServiceApi.getMurabahaBalance(murabahaId!).then(response => response.data)
  },
  refetchOnMount: 'always',
  enabled: !!murabahaId,
})
};

