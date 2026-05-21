import { apiClient } from "../axios/apiClient"

export const DeviceServiceApi = {
    getClientDevices(absId: string, page: number, size: number, sort: string) {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort,
        }).toString()

        return apiClient.get(`/admin-backend/device/api/v1/dfp/${absId}/devices/last?${params}`)
    }
}
