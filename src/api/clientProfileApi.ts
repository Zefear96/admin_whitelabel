import {apiClient} from "./axios";

export const ClientProfileApi = {
    getClientByAbs(absId: string) {
        return apiClient.get(`/api/v1/client/${absId}/by-abs-id`)
    }
}