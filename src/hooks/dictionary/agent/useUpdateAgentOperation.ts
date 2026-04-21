import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AgentOperationType, AgentOperationUpsertPayload } from "../../../types/dictionary/agentOperationType"
import type { AxiosError, AxiosResponse } from "axios"

export const useUpdateAgentOperation = () => {
    const queryClient = useQueryClient()

    return useMutation<AxiosResponse<AgentOperationType>, AxiosError, AgentOperationUpsertPayload>({
        mutationFn: (payload) => DictionaryServiceApi.updateAgentOperation(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["dictionary", "agent-operations", variables.agent],
            })
        },
    })
}
