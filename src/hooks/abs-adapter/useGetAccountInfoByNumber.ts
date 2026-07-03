import { useQuery } from "@tanstack/react-query"
import { AbsAdapterApi } from "../../api/clients/absAdapterApi"
import type { AccountInfoType } from "../../types/abs-adapter/AccountInfoType"
import type { AxiosError } from "axios"

export const useGetAccountInfoByNumber = (accountNumber: string) => {
    return useQuery<AccountInfoType, AxiosError>({
        queryKey: ["abs-adapter", "account-info", accountNumber],
        queryFn: async () => {
            return await AbsAdapterApi.getAccountInfoByNumber(accountNumber).then(response => response.data)
        },
        refetchOnMount: 'always',
        enabled: !!accountNumber,
    })
}