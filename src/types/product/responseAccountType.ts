export interface ResponseAccountType {
    id: string
    iban: string
    accountNumber: string
    productName: string
    productCode: string
    currency: string
}

export interface ResponseAccountBalanceType {
    accountId: string
    accountNumber: string
    currency: string
    availableAmount: number
    blockedAmount: any
    active: boolean
    isAmountBlocked: boolean
}