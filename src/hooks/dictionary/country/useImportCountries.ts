import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"

export const useImportCountries = () => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse, AxiosError, File>({
        mutationFn: (file: File) => DictionaryServiceApi.importCountries(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dictionary', 'country'] })
        }
    })
}
