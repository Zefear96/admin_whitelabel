export interface AgentOperationType {
    id: string
    agent: string
    direction: "INCOMING" | "OUTGOING"
    transactionType: "CARD_CREDIT" | "CARD_DEBIT" | "ACCOUNT_CREDIT" | "ACCOUNT_DEBET" | "LOAN_PAYMENT" | "DEPOSIT_CREDIT"
    serviceName: string
    isEnabled: boolean
    changeDate: string
    changedBy: string
    startDate: string
    endDate: string
    minAmount: number
    maxAmount: number
    isArchived: string
    active: boolean
}