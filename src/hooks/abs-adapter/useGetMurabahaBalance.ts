import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { MurabahaBalanceDataType } from "../../types/abs-adapter/MurabahaDataType";
import type { AxiosError } from "axios";
import { AbsAdapterApi } from "../../api/clients/abs-adapter";

export const useGetMurabahaBalance = (murabahaId: string | undefined) => {
  return useQuery<MurabahaBalanceDataType, AxiosError>({
    queryKey: ["product", "murabaha-balance", murabahaId],
    queryFn: async() => {
      return await AbsAdapterApi.getMurabahaStatusByCode(murabahaId!).then(response => response.data)
  },
  refetchOnMount: 'always',
  enabled: !!murabahaId,
})
};

