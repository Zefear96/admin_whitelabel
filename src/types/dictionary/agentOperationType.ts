export interface AgentOperationType {
    id: string
    agent: string
    direction: AgentOperationDirection
    transactionType: AgentOperationTransactionType
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

export type AgentOperationDirection = "INCOMING" | "OUTGOING"
export type AgentOperationTransactionType =
    | "CARD_CREDIT"
    | "CARD_DEBIT"
    | "ACCOUNT_CREDIT"
    | "ACCOUNT_DEBET"
    | "LOAN_PAYMENT"
    | "DEPOSIT_CREDIT"

export type AgentOperationUpsertPayload = Omit<AgentOperationType, "id"> & { id?: string }