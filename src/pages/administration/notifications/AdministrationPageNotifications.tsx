import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import SendNotificationTab from "./SendNotificationTab";
import NotificationTemplateTab from "./NotificationTemplateTab";

const TAB_KEYS = ["send", "templates"] as const;
const DEFAULT_TAB = "send";

export default function AdministrationPageNotifications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeKey = TAB_KEYS.includes(tabParam as (typeof TAB_KEYS)[number])
    ? (tabParam as string)
    : DEFAULT_TAB;

  const onTabChange = (key: string) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", key);
        return prev;
      },
      { replace: true },
    );
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      items={[
        {
          key: "send",
          label: "Отправка уведомлений",
          children: <SendNotificationTab />,
        },
        {
          key: "templates",
          label: "Шаблоны уведомлений",
          children: <NotificationTemplateTab />,
        },
      ]}
    />
  );
}
