import { useQuery } from "@tanstack/react-query"
import { TransactionsBankHistoryAnalyticsApi } from "../api/clients/analyticsTransactionsBankApi"
import { historyTx } from "../api/mock/historyTx"

export const useTxBanksHistory = (bankCode?:string, fromDate?:string, toDate?:string) => {
    return useQuery({
        queryKey:['tx-history-banks', bankCode, fromDate, toDate],
        queryFn: async () => {
            if(!bankCode) {
                throw new Error("Bank code is required")
            }

            // const {data} = await TransactionsBankHistoryAnalyticsApi.getAnalyticsTransactionsBankApi(bankCode, fromDate, toDate)
            // const firstKey = Object.keys(data)[0]
            // const arrayData = data[firstKey] || []
            // console.log(`TransactionsBankHistoryAnalyticsApi:`, arrayData)
            // return arrayData;
            const data = historyTx;
            console.log(data)
            return data;
        }
    })
}