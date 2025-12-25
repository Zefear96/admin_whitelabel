import {apiClient} from "../axios/apiClient";

export const ClientProfileApi = {
    getClientByAbs(absId: string) {
        return apiClient.get(`/admin-backend/api/v1/admin/client/by-abs/${absId}`)
    }
}