import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { BankType } from "../../../types/dictionary/bankType"

export const useUpdateAgent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: BankType) =>
            DictionaryServiceApi.updateAgent(payload).then((response) => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dictionary", "agent"] })
        },
    })
}

