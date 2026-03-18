import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AccountEibType } from "../../../types/dictionary/accountType"
import type { AxiosError, AxiosResponse } from "axios"

export const useUpdateAccount = () => {
    const queryClient = useQueryClient()
    return useMutation<AxiosResponse<AccountEibType>, AxiosError, AccountEibType>({
        mutationFn: (payload: AccountEibType) => {
            return DictionaryServiceApi.updateEibAccount(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dictionary', 'eib_account'] })
        }
    })
}