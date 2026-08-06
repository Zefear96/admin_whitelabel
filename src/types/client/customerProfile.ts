export interface CustomerProfileType {
  id: string
  absClientId: string
  mpcClientId?: string
  keycloakClientId: string
  inn: string
  firstName: string
  lastName: string
  birthDate: string
  phoneNumber: string
  email: string
  confirmOfferAgreementDate: string
  deviceInfo: string
  statusHistory: StatusHistory[]
  currentStatus: CurrentStatus
  createDate: string
  updateDate: string
  isCitizen: boolean
}

export interface StatusHistory {
  status: string
  comment: string
  createdAt: string
  changedBy: string
}

export interface CurrentStatus {
  status: string
  comment: string
  createdAt: string
  changedBy: string
}

export interface SearchClientsParams {
  absNumber?: string
  inn?: string
  phoneNumber?: string
  firstname?: string
  surName?: string
  page?: number
  size?: number
  sort?: string
}
