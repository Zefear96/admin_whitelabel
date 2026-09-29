import type { VersionResponseType, VersionType } from "../../types/version-service/versionType";
import { apiClient } from "../axios/apiClient";

export const versionService = {
    getVersion() {
        return apiClient.get<VersionResponseType>('/admin-backend/version-service/api/v1/version');
    },
    createVersion(version: VersionType) {
        return apiClient.post('/admin-backend/version-service/api/v1/version', version);
    },
    updateVersion(id: string, version: VersionType) {
        return apiClient.put(`/admin-backend/version-service/api/v1/version/${id}`, version);
    },
    deleteVersion(id: string) {
        return apiClient.delete(`/admin-backend/version-service/api/v1/version/${id}`);
    }
}