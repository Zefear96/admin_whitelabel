import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { versionService } from "../../api/clients/versionServiceApi"
import type { VersionType } from "../../types/version-service/versionType"

export const useCreateVersion = () => {
    const queryClient = useQueryClient()
    return useMutation<AxiosResponse<VersionType>, AxiosError, VersionType>({
        mutationFn: (version: VersionType) => versionService.createVersion(version),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["version-service", "version"] }),
    })
}
