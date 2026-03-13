export interface ResponseCardType {
    id: string
    active: boolean
    cardNumber: string
    currency: string
    expiry: string
}

export interface ResponseCardBalanceType {
    cardId: string
    cardNumber: string
    cardExpiry: string
    active: boolean
    currency: string
    availableAmount: number
    initialAmount: number
    bonusAmount: number
    creditLimit: number
    lockedBackofficeAmount: number
    lockedBackofficeAmountOffline: number
    lockedAmount: number
}