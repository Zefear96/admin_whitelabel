import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/dictionaryServiceApi"

export const useGetAgentList = () => {
    return useQuery({
        queryKey: ['dictionary', 'agent'],
        queryFn: () => {
            return DictionaryServiceApi.getBankAgents().then(response => response.data ?? [])
        }
    })
}