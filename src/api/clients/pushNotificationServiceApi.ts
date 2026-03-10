import { apiClient } from "../axios/apiClient";
import type { RequestBodyNotificationType } from "../../types/pushNotification/requestBodyNotificationType";

export const PushNotificationServiceApi = {
  sendGlobalNotification(payload: RequestBodyNotificationType) {
    return apiClient.post(
      "/admin-backend/push-notification-service/api/v1/notifications/send",
      payload,
    );
  },
};

