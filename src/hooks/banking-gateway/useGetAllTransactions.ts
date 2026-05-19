import { useQuery } from "@tanstack/react-query"
import { BankingGatewayApi } from "../../api/clients/bankingGatewayApi"
import type { AxiosError } from "axios"
import type { IncomingTransactionListType, IncomingTransactionType } from "../../types/banking-gateway/transactionsType"

export const useGetAllTransactions = (page: number, size: number, sort: string, direction: string) => {
    return useQuery<IncomingTransactionListType, AxiosError>({
        queryKey: ['banking-gateway', 'transaction', page, size, sort, direction],
        queryFn: async () => {
            const response = await BankingGatewayApi.getAllIncomingTransactions(
                page,
                size,
                sort,
                direction
            )
            return response.data
        },
        staleTime: 1000 * 30,
        refetchOnMount:'always',
    })
}