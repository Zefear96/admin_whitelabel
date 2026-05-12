import { useMutation } from "@tanstack/react-query";
import { registryAgentServiceApi } from "../../api/clients/registryAgentServiceApi";
import type { RegistryType } from "../../types/registry/registryType";

export const useCreateOutgoingRegistryTask = () => {
  return useMutation({
    mutationFn: async ({
      bankCode,
      dateFrom,
      dateTo,
    }: {
      bankCode: string;
      dateFrom: string;
      dateTo: string;
    }) => {
      const response = await registryAgentServiceApi.createOutgoingTransactionsRegistry(
        bankCode,
        dateFrom,
        dateTo,
      );
      return response.data as RegistryType;
    },
  });
};

