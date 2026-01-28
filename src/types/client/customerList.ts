import type { CustomerProfileType } from "./customerProfile"

export interface CustomerListType {
    clients: CustomerProfileType[]
    page: number
    size: number
    totalElements: number
    totalPages: number
}