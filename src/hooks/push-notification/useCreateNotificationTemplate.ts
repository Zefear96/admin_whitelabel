import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PushNotificationServiceApi } from "../../api/clients/pushNotificationServiceApi";
import type { NotificationTemplateType } from "../../types/pushNotification/notificationTemplateType";

export const useCreateNotificationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotificationTemplateType) =>
      PushNotificationServiceApi.createNotificationTemplate(payload).then(
        (response) => response.data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notification", "templates"] });
    },
  });
};
