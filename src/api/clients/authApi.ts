import type { BlockType, ResponseBlockedUserType } from "../../types/auth/afsType";
import { apiClient } from "../axios/apiClient";

const userBlocksUrl = (userId: string, blockType: BlockType, reason: string) => {
    const params = new URLSearchParams({ blockType, reason });
    return `/admin-backend/auth/api/v1/internal/users/${userId}/blocks?${params.toString()}`;
};

export const authApi = {
    blockUser: async (userId: string, blockType: BlockType, reason: string) => {
        const response = await apiClient.post(userBlocksUrl(userId, blockType, reason));
        return response.data;
    },
    unblockUser: async (userId: string, blockType: BlockType, reason: string) => {
        const response = await apiClient.delete(userBlocksUrl(userId, blockType, reason));
        return response.data;
    },
    getStatusUser: async (userId: string) => {
        const response = await apiClient.get(`/admin-backend/auth/api/v1/internal/users/${userId}/blocking-status`);
        return response.data;
    },
    getBlockedUsers: async (): Promise<ResponseBlockedUserType[]>    => {
        const response = await apiClient.get(`/admin-backend/auth/api/v1/internal/users/blocks`);
        return response.data;
    }
}
