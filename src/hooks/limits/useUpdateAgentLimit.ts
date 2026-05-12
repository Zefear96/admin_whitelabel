import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LimitServiceApi } from "../../api/clients/limitServiceApi";
import type { AgentLimitType } from "../../types/limit/limitType";

export const useUpdateAgentLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AgentLimitType) => {
      const { data } = await LimitServiceApi.updateAgentLimit(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-limits"] });
    },
  });
};

