import { Alert, Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetNotificationTemplates } from "../../../hooks/push-notification/useGetNotificationTemplates";
import type { NotificationTemplateType } from "../../../types/pushNotification/notificationTemplateType";
import ButtonCreate from "../../../components/dataEntry/ButtonCreate";
import { useState } from "react";
import NotificationTemplateModal from "./NotificationTemplateModal";
import NotificationTemplateModalCreate from "./NotificationTemplateModalCreate";

export default function NotificationTemplateTab() {
    const { data, isLoading, error } = useGetNotificationTemplates();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<NotificationTemplateType | null>(null);

    const columns: ColumnsType<NotificationTemplateType> = [
        {
            title: "Категория",
            dataIndex: "category",
        },
        {
            title: "Код",
            dataIndex: "code",
        },
        {
            title: "Сервис",
            dataIndex: "serviceName",
        },
        {
            title: "Заголовок (RU)",
            dataIndex: "titleRu",
            ellipsis: true,
        },
        {
            title: "Текст (RU)",
            dataIndex: "bodyRu",
            ellipsis: true,
        },
    ];

    return (
        <Card
            title="Список шаблонов уведомлений"
            extra={<ButtonCreate title="Добавить шаблон" onClick={() => setIsCreateModalOpen(true)} />}
        >
            {error && <Alert type="error" showIcon message="Не удалось загрузить шаблоны" />}
            <NotificationTemplateModalCreate
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                data={null}
            />
            <NotificationTemplateModal
                isModalOpen={isPreviewModalOpen}
                setIsModalOpen={setIsPreviewModalOpen}
                data={selectedRow}
            />
            <Table
                rowKey={(row) => row.code}
                columns={columns}
                loading={isLoading}
                dataSource={data ?? []}
                pagination={{ pageSize: 20 }}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedRow(record);
                        setIsPreviewModalOpen(true);
                    },
                })}
                style={{ cursor: "pointer" }}
                scroll={{ x: 'max-content' }}
            />
        </Card>
    );
}