import { apiClient } from "../axios/apiClient";
import type { GlobalNotificationType } from "../../types/pushNotification/GlobalNotificationType";
import type { NotificationTemplateUpsertPayload } from "../../types/pushNotification/notificationTemplateType";

export const PushNotificationServiceApi = {
  sendGlobalNotification(payload: GlobalNotificationType) {
    return apiClient.post(
      "/admin-backend/push-notification-service/api/v1/notifications/global",
      payload,
    );
  },
  getNotificationTemplates(page = 0, size = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return apiClient.get(
      `/admin-backend/push-notification-service/api/v1/notification-templates?${params.toString()}`,
    );
  },
  createNotificationTemplate(payload: NotificationTemplateUpsertPayload) {
    return apiClient.post(
      "/admin-backend/push-notification-service/api/v1/notification-templates",
      payload,
    );
  },
  // updateNotificationTemplate(payload: NotificationTemplateType) {
  //   return apiClient.put(
  //     "/admin-backend/push-notification-service/api/v1/notifications/templates",
  //     payload);
  // },
  // deleteNotificationTemplate(id: string) {
  //   return apiClient.delete(`/admin-backend/push-notification-service/api/v1/notifications/templates/${id}`);
  // },
};

