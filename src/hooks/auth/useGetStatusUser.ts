import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/clients/authApi";
import { normalizeUserBlockStatus, type UserBlockStatus } from "../../types/auth/userBlockStatus";
import type { AxiosError } from "axios";

export const useGetAntifraudStatusUser = (userId?: string) => {
  return useQuery<UserBlockStatus, AxiosError>({
    queryKey: ["auth", "block-status", userId],
    queryFn: async () => {
      if (!userId) {
        return { blocked: false };
      }

      const data = await authApi.getStatusUser(userId);
      return normalizeUserBlockStatus(data);
    },
    enabled: !!userId,
    refetchOnMount: 'always',
  });
};
