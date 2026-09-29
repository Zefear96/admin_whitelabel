import type { DocumentBodyType, DocumentRequestType } from "../../types/documentService/documentType";
import { apiClient } from "../axios/apiClient";

export const documentService = {
    getDocuments() {
        return apiClient.get(`/admin-backend/document-service/api/v1/documents`);
    },
    createDocument(type: DocumentRequestType['type'], document: DocumentBodyType) {
        return apiClient.post(`/admin-backend/document-service/api/v1/document/${type}`, document);
    },
    updateStatusDocument(id: string, status: 'ACTIVE' | 'INACTIVE') {
        return apiClient.patch(`/admin-backend/document-service/api/v1/documents/${id}/status`, { status });
    }
}