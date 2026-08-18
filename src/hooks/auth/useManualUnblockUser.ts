import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/clients/authApi";
import type { AxiosError } from "axios";
import type { RequestBodyAntifraud } from "../../types/auth/requestBodyAntifraud";

type ManualUnblockVariables = {
  userId: string;
  requestBody: RequestBodyAntifraud;
};

export const useManualUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, ManualUnblockVariables>({
    mutationFn: ({ userId, requestBody }) => authApi.manualUnblockUser(userId, requestBody),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "block-status", userId] });
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
    },
  });
};
