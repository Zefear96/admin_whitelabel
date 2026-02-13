import { apiClient } from "../axios/apiClient"

export const DeviceServiceApi = {
    getClientDevices(absId: string, page:string, size:string, sortDirection:string) {
        const params = new URLSearchParams({
            page,
            size,
            sort: "lastSeenAt",
            direction: sortDirection,
        }).toString()

        return apiClient.get(`/admin-backend/device/api/v1/dfp/${absId}/devices/last?${params}`)
    }
}
