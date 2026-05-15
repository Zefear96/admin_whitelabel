import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LimitServiceApi } from "../../api/clients/limitServiceApi";
import type { LimitType } from "../../types/limit/limitType";

export const useCreateLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LimitType) => {
      const { data } = await LimitServiceApi.createLimit(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limits"] });
    },
  });
};

