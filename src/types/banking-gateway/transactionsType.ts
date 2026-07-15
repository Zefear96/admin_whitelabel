export interface IncomingTransactionListType {
  page: number
  size: number
  total: number
  content: IncomingTransactionType[]
}

export interface IncomingTransactionType {
  id: string
  transactionType: string
  amount: number
  receiver: string
  currency: string
  agent: string
  creationDate: string
  updateDate: string
  status: string
  externalId: string
  bill: string
  error: any
}

