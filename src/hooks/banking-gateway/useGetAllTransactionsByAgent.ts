import { useQuery } from "@tanstack/react-query"
import { BankingGatewayApi } from "../../api/clients/bankingGatewayApi"
import type { AxiosError } from "axios"
import type { IncomingTransactionListType } from "../../types/banking-gateway/transactionsType"

export const useGetTransactionsByAgent = (
    agent: string,
    page: number,
    size: number,
    sort: string,
    direction: string,
    creationDateMin?: string,
    creationDateMax?: string,
    status?: string,
) => {
    return useQuery<IncomingTransactionListType, AxiosError>({
        queryKey: [
            "banking-gateway",
            "transaction",
            agent,
            page,
            size,
            sort,
            direction,
            creationDateMin ?? "",
            creationDateMax ?? "",
            status ?? "",
        ],
        queryFn: async () => {
            const response = await BankingGatewayApi.getIncomingTransactionsByAgent(
                    agent,
                    page,
                    size,
                    sort,
                    direction,
                    creationDateMin,
                    creationDateMax,
                    status,
            )
            return response.data
        },
        staleTime: 1000 * 30,
        enabled: !!agent,
        refetchOnMount: "always",
    })
}
