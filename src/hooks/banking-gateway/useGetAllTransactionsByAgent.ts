import { useQuery } from "@tanstack/react-query"
import { BankingGatewayApi } from "../../api/clients/bankingGatewayApi"
import type { AxiosError } from "axios"
import type { IncomingTransactionListType, IncomingTransactionType } from "../../types/banking-gateway/transactionsType"

export const useGetTransactionsByAgent = (agent: string, page: number, size: number, sort: string, direction: string) => {
    return useQuery<IncomingTransactionListType, AxiosError>({
        queryKey: ['banking-gateway', 'transaction'],
        queryFn: async () => {
            const response = await BankingGatewayApi.getIncomingTransactionsByAgent(
                agent,
                page,
                size,
                sort,
                direction
            )
            return response.data
        },
        staleTime: 1000 * 30,
        enabled: !!agent,
        refetchOnMount:'always',
    })
}