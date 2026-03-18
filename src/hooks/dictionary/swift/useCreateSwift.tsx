import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SwiftType } from "../../../types/dictionary/swiftType"
import type { AxiosError, AxiosResponse } from "axios"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"

export const useCreateSwift = () => {
    const queryClient = useQueryClient()
    return useMutation<AxiosResponse<SwiftType>, AxiosError, SwiftType>({
        mutationFn: (payload: SwiftType) => DictionaryServiceApi.createSwift(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dictionary', 'swift'] })
        },
    })
}