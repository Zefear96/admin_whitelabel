import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { ResponseCardBalanceType } from "../../types/product/responseCardType";
import type { AxiosError } from "axios";

export const useGetCardBalance = (cardId: string | undefined) => {
  return useQuery<ResponseCardBalanceType, AxiosError>({
    queryKey: ["product", "card-balance", cardId],
    queryFn: async() => {
      return await ProductServiceApi.getCardBalance(cardId!).then(response => response.data)
  },
  refetchOnMount: 'always',
  enabled: !!cardId,
})
};

