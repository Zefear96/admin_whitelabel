export interface MudarabaDataType {
    id: string
    accountNumber: string
    productName: string
    productCode: string
    currency: string
    rate: number
    openDate: string
    expiryDate: string
}

export interface MudarabaBalanceDataType {
    mudarabahId: string
    statusActive: boolean
    availableAmount: number
    profitAmount: number
}