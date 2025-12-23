import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/dictionaryServiceApi"

export const useGetCurrencyList = () => {
    return useQuery({
        queryKey: ['dictionary', 'currency'],
        queryFn: () => {
            return DictionaryServiceApi.getCurrencies().then(res => res.data)
        }
    })
}