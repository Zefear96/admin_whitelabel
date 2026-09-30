import { Card, Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import VersioningTab from "./tabs/versions/VersioningTab";
import Title from "antd/es/typography/Title";
import LocalizationsTab from "./tabs/localizations/LocalizationsTab";
import DocumentsTab from "./tabs/documents/DocumentsTab";

const TAB_KEYS = ["versioning", "localizations", "documents"] as const;
const DEFAULT_TAB = "versioning";

export default function AdministrationPageClientsSettings() {
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
        <div>
            <Title level={3}>Клиентские настройки</Title>
            <Tabs
                activeKey={activeKey}
                onChange={onTabChange}
                items={[
                    {
                        key: "versioning",
                        label: "Версионирование",
                        children: <VersioningTab />,
                    },
                    {
                        key: "documents",
                        label: "Документы",
                        children: <DocumentsTab />,
                    },
                    {
                        key: "localizations",
                        label: "Локализация",
                        children: <LocalizationsTab />,
                    },
                ]}
            />
        </div>
    );
}
