import type { DocumentBodyType, DocumentRequestType, DocumentResponseType } from "../../types/documentService/documentType";
import { apiClient } from "../axios/apiClient";

export const documentService = {
    getDocuments() {
        return apiClient.get<DocumentResponseType[]>(`/admin-backend/document-service/api/v1/documents`);
    },
    createDocument(type: DocumentRequestType["type"], document: DocumentBodyType) {
        const formData = new FormData();
        formData.append("file", document.file);

        return apiClient.post<DocumentResponseType>(
            `/admin-backend/document-service/api/v1/document/${type}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
    },
    updateStatusDocument(id: string, status: DocumentResponseType["status"]) {
        return apiClient.patch<DocumentResponseType>(`/admin-backend/document-service/api/v1/documents/${id}/status`, { status });
    },
};