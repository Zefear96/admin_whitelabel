import {apiClient} from "../axios/apiClient";

export const ClientProfileApi = {
    getClientByAbs(absClientId: string) {
        return apiClient.get(`/admin-backend/client-profile/api/v1/client/${absClientId}/by-abs-id`)
    },
    getClientList(page?: number, size?: number, sort?: string) {
        const params = new URLSearchParams({
            page: page?.toString() ?? "0",
            size: size?.toString() ?? "20",
            sort: sort ?? "createdDate,ASC"
        })
        return apiClient.get(`/admin-backend/client-profile/api/v1/client/list?${params.toString()}`)
    }
}
