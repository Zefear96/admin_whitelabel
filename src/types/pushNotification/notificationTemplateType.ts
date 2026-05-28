export interface NotificationTemplateResponseType {
    content: Content[]
    pageable: Pageable
    totalElements: number
    totalPages: number
    last: boolean
    sort: Sort
    numberOfElements: number
    first: boolean
    number: number
    size: number
    empty: boolean
}

export interface NotificationTemplateType {
    id: string
    code: string
    category: NotificationTemplateCategoryEnum
    serviceName: string
    titleKy: string
    titleEn: string
    titleRu: string
    bodyKy: string
    bodyEn: string
    bodyRu: string
    contentBlocks: NotificationTemplateContentBlockType[]
    createdAt: string
}

export type Content = NotificationTemplateType

export interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    paged: boolean
    unpaged: boolean
}

export interface Sort {
    unsorted: boolean
    sorted: boolean
    empty: boolean
}

export enum NotificationTemplateCategoryEnum {
    NEWS = "NEWS",
    PAYMENT = "PAYMENT",
    SYSTEM = "SYSTEM",
}

export interface NotificationTemplateContentBlockType {
    type: NotificationTemplateContentBlockTypeEnum
    avatarUrl?: string
    action?: string
    url?: string
    imageUrl?: string
    title?: string
    text?: string
}

export enum NotificationTemplateContentBlockTypeEnum {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    LINK = "LINK",
}

export type NotificationTemplateUpsertPayload = Omit<NotificationTemplateType, "id" | "createdAt"> & {
    id?: string
    createdAt?: string
}