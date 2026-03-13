export interface ResponseMurabahaType {
    id: string
    productName: string
    productCode: string
    currency: string
    openDate: string
    expiryDate: string
}

export interface ResponseMurabahaBalanceType {
    murabahaId: string
    statusActive: boolean
    outstandingAmount: number
}