import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"

export const useGetSwiftList = () => {
    return useQuery({
        queryKey: ['dictionary', 'swift'],
        queryFn: () => {
            return DictionaryServiceApi.getSwiftCodesList().then(res => res.data ?? [])
        }
    })
}