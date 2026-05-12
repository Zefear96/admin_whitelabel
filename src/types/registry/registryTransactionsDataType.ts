export interface RegistryTransactionsDataType {
    items: Items
}

export interface Items {
    content: Content[]
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

export interface Content {
    id: number
    taskId: string
    createdDate: string
    transactionId: string
    transactionDate: string
    userId: string
    recipientName: string
    recipientRequisite: string
    senderRequisite: string
    recipientRequisiteType: string
    senderRequisiteType: string
    paymentType: string
    paymentSubType: string
    amount: number
    fee: number
    totalAmount: number
    operationCurrency: string
    feeCurrency: string
    direction: string
    status: string
    recipientMessage: string | null
}

export interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    paged: boolean
    unpaged: boolean
}

export interface Sort {
    sorted: boolean
    unsorted: boolean
    empty: boolean
}
