import { useQuery } from "@tanstack/react-query"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AccountEibType } from "../../../types/dictionary/accountType";

export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['dictionary', 'eib_account'],
        queryFn: () => {
           return DictionaryServiceApi.getAccountEibList().then(res => res.data);
             
        }
    })
}