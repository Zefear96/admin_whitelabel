import { useQuery } from "@tanstack/react-query"
import { registryAiylServiceApi } from "../../api/clients/registryAiylServiceApi"
import dayjs from "dayjs";

const today = dayjs();
const DEFAULT_FROM = today.format("YYYY-MM-DD");
const DEFAULT_TO = today.subtract(7, "day").format("YYYY-MM-DD");

export const useRegistryAgent = (
    bankCode?: string,
    from?: string,
    to?: string,
    page = 0,
    size = 20,
) => {
    return useQuery({
        queryKey: ['registry-agent', bankCode, from, to, page, size],
        queryFn: async () => {
            const { data } = await registryAiylServiceApi.getOutgoingTransactionsAyil(
                bankCode!,
                from ?? DEFAULT_FROM,
                to ?? DEFAULT_TO,
                page,
                size,
            )
            return data;
        },
        enabled: !!bankCode,
    })
}