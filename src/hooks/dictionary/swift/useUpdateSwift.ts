import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SwiftType } from "../../../types/dictionary/swiftType"
import { DictionaryServiceApi } from "../../../api/clients/dictionaryServiceApi"
import type { AxiosError, AxiosResponse } from "axios"

export const useUpdateSwift= () => {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<SwiftType>, AxiosError, SwiftType>({
        mutationFn: (payload: SwiftType) => DictionaryServiceApi.updateSwift(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dictionary', 'swift'] })
        }
    })
}