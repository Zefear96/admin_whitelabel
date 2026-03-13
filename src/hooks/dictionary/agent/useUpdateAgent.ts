import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AgentType } from "../../../types/dictionary/agentType"

export const useUpdateAgent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: AgentType) =>
            DictionaryServiceApi.updateAgent(payload).then((response) => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dictionary", "agent"] })
        },
    })
}

