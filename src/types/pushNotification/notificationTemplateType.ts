export interface NotificationTemplateType {
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

export type NotificationTemplateUpsertPayload = Omit<NotificationTemplateType, "id"> & { id?: string }