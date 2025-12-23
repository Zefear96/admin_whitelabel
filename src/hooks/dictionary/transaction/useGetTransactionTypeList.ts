import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/dictionaryServiceApi"

export const useGetTransactionTypeList = () => {
    return useQuery({
        queryKey: ['dictionary', 'transaction-type'],
        queryFn: () => {
           return DictionaryServiceApi.getTransactionTypes().then(res => res.data)
        }
    })
}