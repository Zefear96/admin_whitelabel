import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"

export const useGetRiskLevelList = () => {
    return useQuery({
        queryKey: ['dictionary', 'risk-level'],
        queryFn: () => {
            DictionaryServiceApi.getRiskLevels().then(response => response.data)
        }
    })
}