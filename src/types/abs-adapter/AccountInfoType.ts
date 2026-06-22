export interface AccountInfoType {
    branchNo: number
    customerNo: number
    subAccount: number
    accountNo: string
    balanceAccount: string
    ccyId: number
    balanceCommon: number
    balanceAZN: number
    balance: number
    blockedAmount: number
    accountType: string
    isDormant: boolean
    debetTurnover: number
    creditTurnover: number
    relatedLoanCount: number
    relatedDepositsCount: number
    todayTransactionsCount: number
    dormant: boolean
}