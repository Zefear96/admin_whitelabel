import { Tabs } from "antd";
import SendNotificationTab from "./SendNotificationTab";
import NotificationTemplateTab from "./NotificationTemplateTab";

export default function AdministrationPageNotifications() {
  

  return (

    <Tabs defaultActiveKey="1" items={[
      {
        key: "1",
        label: "Отправка уведомлений",
        children: <SendNotificationTab />,
      },
      {
        key: "2",
        label: "Шаблоны уведомлений",
        children: <NotificationTemplateTab />,
      },
    ]} />
  );
}

