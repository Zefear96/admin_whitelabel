import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/clients/authApi";
import type { AxiosError } from "axios";
import type { RequestBodyAntifraud } from "../../types/auth/requestBodyAntifraud";

type ManualBlockVariables = {
  userId: string;
  requestBody: RequestBodyAntifraud;
};

export const useManualBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, ManualBlockVariables>({
    mutationFn: ({ userId, requestBody }) => authApi.manualBlockUser(userId, requestBody),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "block-status", userId] });
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
    },
  });
};
