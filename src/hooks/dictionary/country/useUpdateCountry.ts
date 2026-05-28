import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { CountryUpdatePayload } from "../../../types/dictionary/countryType"

export const useUpdateCountry = () => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse<CountryUpdatePayload>, AxiosError, CountryUpdatePayload>({
        mutationFn: (payload: CountryUpdatePayload) => DictionaryServiceApi.updateCountry(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dictionary', 'country'] })
        }
    })
}
