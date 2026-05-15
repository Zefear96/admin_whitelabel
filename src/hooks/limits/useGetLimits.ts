import { useQuery } from "@tanstack/react-query";
import type { LimitType } from "../../types/limit/limitType";
import type { AxiosError } from "axios";
import { LimitServiceApi } from "../../api/clients/limitServiceApi";

export const useGetLimits = () => {
    return useQuery<LimitType[], AxiosError>({
        queryKey: ['limits'],
        queryFn: async () => {
            const { data } = await LimitServiceApi.getLimits();
            return data;
        },
    });
}