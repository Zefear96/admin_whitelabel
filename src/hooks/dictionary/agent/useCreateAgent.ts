import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AgentType } from "../../../types/dictionary/agentType"

export const useCreateAgent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: AgentType) =>
            DictionaryServiceApi.createAgent(payload).then((response) => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dictionary", "agent"] })
        },
    })
}

