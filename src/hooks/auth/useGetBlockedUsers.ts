import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/clients/authApi";
import type { ResponseBlockedUserType } from "../../types/auth/afsType";

export const useGetBlockedUsers = () => {
    return useQuery<ResponseBlockedUserType[]>({
        queryKey: ['getBlockedUsers'],
        queryFn: () => authApi.getBlockedUsers(),
    });
}