import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { ResponseAccountBalanceType } from "../../types/product/responseAccountType";
import type { AxiosError } from "axios";

export const useGetAccountBalance = (accountNumber: string | undefined) => {
  return useQuery<ResponseAccountBalanceType, AxiosError>({
    queryKey: ["product", "account-balance", accountNumber],
    queryFn: async() => {
      return await ProductServiceApi.getAccountBalance(accountNumber!).then(response => response.data)
  },
  refetchOnMount: 'always',
})
};

