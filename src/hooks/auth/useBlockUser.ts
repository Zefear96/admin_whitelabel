import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/clients/authApi";
import type { AxiosError } from "axios";
import type { BlockType } from "../../types/auth/afsType";

type ManualBlockVariables = {
  userId: string;
  blockType: BlockType;
  reason: string;
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, ManualBlockVariables>({
    mutationFn: ({ userId, blockType, reason }) => authApi.blockUser(userId, blockType, reason),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "block-status", userId] });
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      queryClient.invalidateQueries({ queryKey: ["getBlockedUsers"] });
    },
  });
};
