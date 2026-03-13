import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"

export const useGetAgentOperations = (agent: string | undefined) => {
    return useQuery({
        queryKey: ['dictionary', 'agent-operations', agent],
        queryFn: async () => {
            return await DictionaryServiceApi.getAgentOperations(agent!).then(response => response.data ?? [])
        },
        enabled: !!agent,
        refetchOnMount:'always',
    })
}