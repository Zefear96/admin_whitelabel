import type { AxiosError } from "axios"
import { AbsAdapterApi } from "../../api/clients/absAdapterApi"
import { useQuery } from "@tanstack/react-query"
import type { MurabahaDataType } from "../../types/abs-adapter/MurabahaDataType"

export const useGetMurabahaListByAbsId = (absId: string | undefined) => {
    return useQuery<MurabahaDataType[], AxiosError>({
        queryKey: ["abs-adapter", "murabaha-list", absId],
        queryFn: async () => {
            return await AbsAdapterApi.getMurabahaListByAbsId(absId!).then((res) => res.data ?? [])
        },
        refetchOnMount: 'always',
        enabled: !!absId,
    })
}