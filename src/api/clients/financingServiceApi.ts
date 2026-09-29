import { apiClient } from "../axios/apiClient"

export const FinancingServiceApi = {
    getMurabahaList() {
        return apiClient.get('/admin-backend/financing-service/api/v1/financing-service')
    }
}