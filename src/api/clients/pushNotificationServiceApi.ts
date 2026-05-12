import { apiClient } from "../axios/apiClient";
import type { RequestBodyNotificationType } from "../../types/pushNotification/requestBodyNotificationType";
import type { NotificationTemplateType } from "../../types/pushNotification/notificationTemplateType";

export const PushNotificationServiceApi = {
  sendGlobalNotification(payload: RequestBodyNotificationType) {
    return apiClient.post(
      "/admin-backend/push-notification-service/api/v1/notifications/news",
      payload,
    );
  },
  getNotificationTemplates() {
    return apiClient.get(
      "/admin-backend/push-notification-service/api/v1/notification-templates?page=0&size=20",
    );
  },
  createNotificationTemplate(payload: NotificationTemplateType) {
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

