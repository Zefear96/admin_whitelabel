import { useQuery } from "@tanstack/react-query";
import { registryAgentServiceApi } from "../../api/clients/registryAgentServiceApi";
import type { Task } from "../../types/registry/registryType";

const TERMINAL_STATUSES = ["FINISHED", "SUCCESS", "COMPLETED", "DONE", "FAILED", "ERROR"] as const;

const isTerminalStatus = (status?: string) => {
  if (!status) return false;
  return TERMINAL_STATUSES.includes(status.toUpperCase() as (typeof TERMINAL_STATUSES)[number]);
};

export const useGetRegistryStatus = (taskId?: string, initialStatus?: string) => {
  return useQuery({
    queryKey: ["registry", "status", taskId],
    queryFn: async () => {
      const response = await registryAgentServiceApi.getStatusRegistry(taskId!);
      return response.data as Task;
    },
    enabled: Boolean(taskId) && !isTerminalStatus(initialStatus),
    refetchInterval: (query) => {
      const status = (query.state.data as Task | undefined)?.status ?? initialStatus ?? "";
      return isTerminalStatus(status) ? false : 3000;
    },
    refetchIntervalInBackground: false,
  });
};

export { isTerminalStatus };

