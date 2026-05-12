import { useQuery } from "@tanstack/react-query"
import { registryAgentServiceApi } from "../../api/clients/registryAgentServiceApi"
import dayjs from "dayjs";

const today = dayjs();
const DEFAULT_FROM = today.subtract(1, "day").format("YYYY-MM-DD");
const DEFAULT_TO = today.subtract(2, "day").format("YYYY-MM-DD");

export const useRegistryAgent = (
    bankCode?: string,
    dateFrom?: string,
    dateTo?: string,
) => {
    return useQuery({
        queryKey: ['registry-agent', bankCode, dateFrom, dateTo],
        queryFn: async () => {
            const { data } = await registryAgentServiceApi.createOutgoingTransactionsRegistry(
                bankCode!,
                dateFrom ?? DEFAULT_FROM,
                dateTo ?? DEFAULT_TO,
            )
            return data;
        },
        enabled: !!bankCode,
    })
}