import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"

export const useGetCountryList = () => {
    return useQuery({
        queryKey: ['dictionary', 'country'],
        queryFn: () => {
            return DictionaryServiceApi.getCountries().then(res => res.data)
        }
    })
}