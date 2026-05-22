import { apiClient } from "../axios/apiClient";

export const DEVICE_SORT_LAST_SEEN_DESC = "lastSeenAt,DESC" as const;
export const DEVICE_SORT_LAST_SEEN_ASC = "lastSeenAt,ASC" as const;

const buildDeviceSort = (direction: "ASC" | "DESC") =>
    direction === "ASC" ? DEVICE_SORT_LAST_SEEN_ASC : DEVICE_SORT_LAST_SEEN_DESC;

export const DeviceServiceApi = {
    getClientDevices(absId: string, page: number, size: number, direction: "ASC" | "DESC" = "DESC") {
        const params = new URLSearchParams({
            page: String(page),
            size: String(size),
        });

        return apiClient.get(
            `/admin-backend/device/api/v1/dfp/${absId}/devices/last?${params.toString()}`,
        );
    },
};
