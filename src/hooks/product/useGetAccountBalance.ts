import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import type { AccountBalanceDataType } from "../../types/product/AccountDataType";
import type { AxiosError } from "axios";

export const useGetAccountBalance = (accountNumber: string | undefined) => {
  return useQuery<AccountBalanceDataType, AxiosError>({
    queryKey: ["product", "account-balance", accountNumber],
    queryFn: async() => {
      return await ProductServiceApi.getAccountBalance(accountNumber!).then(response => response.data)
  },
  refetchOnMount: 'always',
  enabled: !!accountNumber,
})
};

