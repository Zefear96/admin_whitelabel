import type { NotificationType } from "../../types/components/notificationType";
import { useNotification } from "./NotificationProvider";

export const useNotificationMessage = () => {
  const { showNotification } = useNotification();

  const notify = (payload: NotificationType) => {
    showNotification(payload);
  };

  return { notify };
};

export default useNotificationMessage;