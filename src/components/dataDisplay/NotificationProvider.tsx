import { createContext, useContext } from "react";
import { notification } from "antd";
import type { NotificationType } from "../../types/components/NotificationType";
import type { PropsWithChildren, ReactNode } from "react";

type ShowNotificationFn = (payload: NotificationType) => void;

interface NotificationContextValue {
  showNotification: ShowNotificationFn;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
};

interface NotificationProviderProps extends PropsWithChildren {
  holder?: ReactNode;
}

export function NotificationProvider({ children, holder }: NotificationProviderProps) {
  const [api, contextHolder] = notification.useNotification();

  const showNotification: ShowNotificationFn = ({ type, title, message }) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {contextHolder}
      {holder}
      {children}
    </NotificationContext.Provider>
  );
}

