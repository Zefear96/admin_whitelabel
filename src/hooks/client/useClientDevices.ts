import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { DeviceHistoryType } from "../../types/client/deviceType"
import type { AxiosError } from "axios"
import { DeviceServiceApi } from "../../api/clients/deviceServiceApi"

export const useClientDevices = (
    absId: string, 
    page: number, 
    size: number, 
    sortDirection: "ASC" | "DESC" = "DESC"
  ) => {
    const sort = sortDirection === "ASC" ? "lastSeenAt,ASC" : "lastSeenAt,DESC";

    return useQuery<DeviceHistoryType, AxiosError>({
      queryKey: ["deviceClient", absId, page, size, sort],
      queryFn: async () => {
        if (!absId) {
          throw new Error("AbsId is required");
        }
  
        const { data } = await DeviceServiceApi.getClientDevices(
          absId,
          page,
          size,
          sortDirection,
        );
  
        return data;
      },
      enabled: !!absId,
      placeholderData: keepPreviousData,
      retry: 1,
    });
  };
