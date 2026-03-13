export interface ResponseMudarabaType {
    id: string
    accountNumber: string
    productName: string
    productCode: string
    currency: string
    rate: number
    openDate: string
    expiryDate: string
}

export interface ResponseMudarabaBalanceType {
    mudarabahId: string
    statusActive: boolean
    availableAmount: number
    profitAmount: number
}