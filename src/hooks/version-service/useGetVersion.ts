import { useQuery } from "@tanstack/react-query"
import { versionService } from "../../api/clients/versionServiceApi"

export const useGetVersion = () => {
    return useQuery({
        queryKey: ["version-service", "version"],
        queryFn: () => versionService.getVersion().then((res) => res.data),
        staleTime: 1000 * 30,
        refetchOnMount: "always",
    })
}
