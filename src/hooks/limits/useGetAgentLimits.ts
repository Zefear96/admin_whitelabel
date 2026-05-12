import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { LimitServiceApi } from "../../api/clients/limitServiceApi";
import type { AgentLimitType } from "../../types/limit/limitType";

export const useGetAgentLimits = () => {
  return useQuery<AgentLimitType[], AxiosError>({
    queryKey: ["agent-limits"],
    queryFn: async () => {
      const { data } = await LimitServiceApi.getAgentLimits();
      return data;
    },
    refetchOnMount: "always",
  });
};

