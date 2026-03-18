import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CurrencyType } from "../../../types/dictionary/currencyType"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AxiosError, AxiosResponse } from "axios";

export const useCreateCurrency = () => {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<CurrencyType>, AxiosError, CurrencyType>({
        mutationFn: (currency: CurrencyType) => DictionaryServiceApi.createCurrency(currency),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dictionary', 'currency'] })
    })
}