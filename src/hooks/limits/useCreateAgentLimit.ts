import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LimitServiceApi } from "../../api/clients/limitServiceApi";
import type { AgentLimitType } from "../../types/limit/limitType";

export const useCreateAgentLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AgentLimitType) => {
      const { data } = await LimitServiceApi.createAgentLimit(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-limits"] });
    },
  });
};

