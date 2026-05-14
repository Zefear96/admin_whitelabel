import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LimitServiceApi } from "../../api/clients/limitServiceApi";
import type { LimitType } from "../../types/limit/limitType";

export const useUpdateLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LimitType) => {
      const { data } = await LimitServiceApi.updateLimit(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limits"] });
    },
  });
};

