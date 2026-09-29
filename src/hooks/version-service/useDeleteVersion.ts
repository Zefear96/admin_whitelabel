import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { versionService } from "../../api/clients/versionServiceApi"

export const useDeleteVersion = () => {
    const queryClient = useQueryClient()
    return useMutation<AxiosResponse<void>, AxiosError, string>({
        mutationFn: (id: string) => versionService.deleteVersion(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["version-service", "version"] }),
    })
}
