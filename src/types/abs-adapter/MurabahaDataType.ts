export interface MurabahaDataType {
    productName: string
    currency: string
    openDate: string
    expireDate: string
    creditCode: number
    murabahaNo: string
    financeAmount: number
    repaymentScheduleCode: string
}

export interface MurabahaBalanceDataType {
    outstandingAmount: number
    active: boolean
    nextPaymentDate: string
    nextRepaymentSum: number
    repaymentAccount: string
}