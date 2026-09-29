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