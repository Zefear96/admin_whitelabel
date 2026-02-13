import { useQueries, useQuery } from "@tanstack/react-query"
import type { DeviceHistoryType } from "../../types/client/deviceType"
import type { AxiosError } from "axios"
import { DeviceServiceApi } from "../../api/clients/deviceServiceApi"
import { keepPreviousData } from "@tanstack/react-query";

export const useClientDevices = (
    absId: string, 
    page: number, 
    size: number, 
    sortDirection: "ASC" | "DESC" = "DESC"
  ) => {
    return useQuery<DeviceHistoryType, AxiosError>({
      queryKey: ["deviceClient", absId, page, size, sortDirection],
      queryFn: async () => {
        if (!absId) {
          throw new Error("AbsId is required");
        }
  
        // Convert numbers to strings if the API expects strings
        const { data } = await DeviceServiceApi.getClientDevices(
          absId,
          String(page),
          String(size),
          sortDirection
        );
  
        return data;
      },
      enabled: !!absId,
    //   keepPreviousData: true, // fixed
      retry: 1,
    });
  };
  