export interface DocumentBodyType {
    file: File;
}

export interface DocumentRequestType {
    type: 'OFFER' | 'PERSONAL_DATA_CONSENT' | 'PRIVACY_POLICY' | 'CONFIDENTIALITY_RESPONSIBILITY';
}

export interface DocumentResponseType {
    id: string;
    type: DocumentRequestType['type'];
    version: string;
    url: string;
    fileName: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentRequestType["type"], string> = {
    OFFER: "Оферта",
    PERSONAL_DATA_CONSENT: "Согласие на обработку персональных данных",
    PRIVACY_POLICY: "Политика конфиденциальности",
    CONFIDENTIALITY_RESPONSIBILITY: "Конфиденциальность и ответственность",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentResponseType["status"], string> = {
    ACTIVE: "Активен",
    INACTIVE: "Неактивен",
};