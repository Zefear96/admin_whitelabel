import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/clients/authApi";
import type { AxiosError } from "axios";

export const useManualUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, string>({
    mutationFn: (userId: string) => authApi.manualUnblockUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "block-status", userId] });
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
    },
  });
};
