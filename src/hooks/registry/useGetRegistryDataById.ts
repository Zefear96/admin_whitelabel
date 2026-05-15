import { useQuery } from "@tanstack/react-query";
import { registryAgentServiceApi } from "../../api/clients/registryAgentServiceApi";
import type { RegistryTransactionsDataType } from "../../types/registry/registryTransactionsDataType";

export const useGetRegistryDataById = (
  taskId?: string,
  page: number = 0,
  size: number = 20,
  isSuccess?: boolean,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["registry", "data", taskId, page, size, isSuccess],
    queryFn: async () => {
      const response = await registryAgentServiceApi.getRegistryDataById(taskId!, page, size, isSuccess);
      return response.data as RegistryTransactionsDataType;
    },
    enabled: Boolean(taskId) && enabled,
    refetchOnMount: "always",
  });
};

