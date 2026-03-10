export interface AgentOperationType {
    id: string
    agent: string
    direction: "INCOMING" | "OUTGOING"
    transactionType: string
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