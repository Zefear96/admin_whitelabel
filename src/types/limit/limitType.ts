export interface LimitType {
    id: string
    operationType: string
    description: string
    currency: string
    maxCount: number
    maxAmount: number
    period: string
    userType: string
    createdAt: string
    updatedAt: string
}

export interface AgentLimitType {
    id: string
    agent: string
    currency: string
    transactionType: string
    direction: string
    minAmount: number
    maxAmount: number
}

export interface LimitUsageType {
    amount: number
    createdAt: string
    currency: string
    id: string
    operationType: string
    status: 'RESERVED' | 'CONFIRMED' | 'CANCELLED'
    transactionId: string
    updatedAt: string
    userId: string
}