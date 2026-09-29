import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { versionService } from "../../api/clients/versionServiceApi"
import type { VersionType } from "../../types/version-service/versionType"

type UpdateVersionPayload = {
    id: string
    version: VersionType
}

export const useUpdateVersion = () => {
    const queryClient = useQueryClient()
    return useMutation<AxiosResponse<VersionType>, AxiosError, UpdateVersionPayload>({
        mutationFn: ({ id, version }) => versionService.updateVersion(id, version),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["version-service", "version"] }),
    })
}
