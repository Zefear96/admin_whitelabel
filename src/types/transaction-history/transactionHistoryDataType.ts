export interface TransactionHistoryDataType {
    content: TransactionHistoryItemType[]
    pageable: Pageable
    totalPages: number
    totalElements: number
    last: boolean
    sort: Sort
    numberOfElements: number
    first: boolean
    number: number
    size: number
    empty: boolean
}

export interface TransactionHistoryItemType {
    transactionId: string
    userId: string
    recipientName?: string
    recipientRequisite: string
    senderRequisite?: string
    paymentType: string
    paymentSubType: string
    recipientRequisiteType: string
    senderRequisiteType: string
    amount: number
    fee: number
    totalAmount: number
    operationCurrency: string
    feeCurrency?: string
    direction: string
    status: string
    recipientMessage?: string
    createdAt: string
}

export interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    unpaged: boolean
    paged: boolean
}

export interface Sort {
    unsorted: boolean
    sorted: boolean
    empty: boolean
}
