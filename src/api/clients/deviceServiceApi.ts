import { apiClient } from "../axios/apiClient";

const buildDeviceSort = (direction: "ASC" | "DESC") => `lastSeenAt,${direction}`;

export const DeviceServiceApi = {
    getClientDevices(absId: string, page: number, size: number, direction: "ASC" | "DESC" = "DESC") {
        return apiClient.get(`/admin-backend/device/api/v1/dfp/${absId}/devices/last`, {
            params: {
                page,
                size,
                sort: buildDeviceSort(direction),
            },
        });
    },
};
