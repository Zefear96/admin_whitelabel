export interface MurabahaDataType {
    id: string
    productName: string
    productCode: string
    currency: string
    openDate: string
    expiryDate: string
}

export interface MurabahaBalanceDataType {
    murabahaId: string
    statusActive: boolean
    outstandingAmount: number
}