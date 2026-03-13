export interface ResponseTransactionType {
    transactionId: string
    userId: string
    recipientName: any
    recipientRequisite: string
    senderRequisite: string
    paymentType: string
    paymentSubType: string
    recipientRequisiteType: string
    senderRequisiteType: string
    amount: number
    fee: number
    totalAmount: number
    operationCurrency: string
    feeCurrency: any
    direction: string
    status: string
    recipientMessage: any
    createdAt: string
}