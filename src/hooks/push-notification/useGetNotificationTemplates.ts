import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PushNotificationServiceApi } from "../../api/clients/pushNotificationServiceApi";
import type {
  NotificationTemplateResponseType,
  NotificationTemplateType,
} from "../../types/pushNotification/notificationTemplateType";

const emptyResponse: NotificationTemplateResponseType = {
  content: [],
  pageable: {
    pageNumber: 0,
    pageSize: 20,
    sort: {
      unsorted: true,
      sorted: false,
      empty: true,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  totalElements: 0,
  totalPages: 0,
  last: true,
  sort: {
    unsorted: true,
    sorted: false,
    empty: true,
  },
  numberOfElements: 0,
  first: true,
  number: 0,
  size: 20,
  empty: true,
};

export const useGetNotificationTemplates = (page = 0, size = 20) => {
  return useQuery<NotificationTemplateResponseType>({
    queryKey: ["push-notification", "templates", page, size],
    queryFn: async () => {
      const response = await PushNotificationServiceApi.getNotificationTemplates(page, size);
      const data = response.data as NotificationTemplateResponseType | NotificationTemplateType[] | undefined;

      if (Array.isArray(data)) {
        return {
          ...emptyResponse,
          content: data,
          totalElements: data.length,
          numberOfElements: data.length,
          empty: data.length === 0,
        };
      }

      return data ?? emptyResponse;
    },
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
  });
};
