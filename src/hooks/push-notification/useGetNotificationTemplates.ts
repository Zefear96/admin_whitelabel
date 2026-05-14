import { useQuery } from "@tanstack/react-query";
import { PushNotificationServiceApi } from "../../api/clients/pushNotificationServiceApi";
import type { NotificationTemplateType } from "../../types/pushNotification/notificationTemplateType";

interface TemplatesResponse {
  content?: NotificationTemplateType[];
}

export const useGetNotificationTemplates = () => {
  return useQuery({
    queryKey: ["push-notification", "templates"],
    queryFn: async () => {
      const response = await PushNotificationServiceApi.getNotificationTemplates();
      const data = response.data as NotificationTemplateType[] | TemplatesResponse | undefined;

      if (Array.isArray(data)) {
        return data;
      }

      return data?.content ?? [];
    },
    refetchOnMount: "always",
  });
};
