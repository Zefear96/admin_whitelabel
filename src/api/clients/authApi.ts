import type { RequestBodyAntifraud } from "../../types/auth/requestBodyAntifraud";
import { apiClient } from "../axios/apiClient";

export const authApi = {
    manualBlockUser: async (userId: string, requestBody: RequestBodyAntifraud) => {
        const response = await apiClient.post(
            `/admin-backend/auth/api/v1/internal/manual/users/${userId}/blocking`,
            requestBody
        );
        return response.data;
    },
    manualUnblockUser: async (userId: string, requestBody: RequestBodyAntifraud) => {
        const response = await apiClient.post(
            `/admin-backend/auth/api/v1/internal/manual/users/${userId}/blocking/unblock`,
            requestBody
        );
        return response.data;
    },
    getStatusUser: async (userId: string) => {
        const response = await apiClient.get(`/admin-backend/auth/api/v1/internal/users/${userId}/block-status`);
        return response.data;
    }
}
