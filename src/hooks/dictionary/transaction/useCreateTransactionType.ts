import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AxiosError, AxiosResponse } from "axios";
import type { TransactionType } from "../../../types/dictionary/transactionType";

export const useCreateTransactionType = () => {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<TransactionType>, AxiosError, TransactionType>({
        mutationFn: (transactionType: TransactionType) => DictionaryServiceApi.createTransactionType(transactionType),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dictionary', 'transaction-type'] })
    })
}