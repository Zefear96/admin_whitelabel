import { Alert, Card, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useGetNotificationTemplates } from "../../../hooks/push-notification/useGetNotificationTemplates";
import type { NotificationTemplateType } from "../../../types/pushNotification/notificationTemplateType";
import ButtonCreate from "../../../components/dataEntry/ButtonCreate";
import { useState } from "react";
import NotificationTemplateModal from "./NotificationTemplateModal";
import NotificationTemplateModalCreate from "./NotificationTemplateModalCreate";
import { NotificationTemplateSkeleton } from "./NotificationTemplateSkeleton";

export default function NotificationTemplateTab() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const { data, isLoading, isFetching, error } = useGetNotificationTemplates(page, pageSize);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<NotificationTemplateType | null>(null);
    const templates = data?.content ?? [];

    const columns: ColumnsType<NotificationTemplateType> = [
        {
            title: "Категория",
            dataIndex: "category",
            sorter: (a, b) =>
                String(a.category ?? "").localeCompare(String(b.category ?? ""), undefined, {
                    sensitivity: "base",
                }),
            defaultSortOrder: "ascend",
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Сервис",
            dataIndex: "serviceName",
            sorter: (a, b) =>
                String(a.serviceName ?? "").localeCompare(String(b.serviceName ?? ""), undefined, {
                    sensitivity: "base",
                }),
            defaultSortOrder: "ascend",
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Код",
            dataIndex: "code",
            sorter: (a, b) =>
                String(a.code ?? "").localeCompare(String(b.code ?? ""), undefined, {
                    sensitivity: "base",
                }),
            defaultSortOrder: "ascend",
            sortDirections: ["ascend", "descend"],
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

    const handleTableChange = (pagination: TablePaginationConfig) => {
        const nextPageSize = Number(pagination.pageSize ?? pageSize);

        if (nextPageSize !== pageSize) {
            setPageSize(nextPageSize);
            setPage(0);
            return;
        }

        setPage(Math.max((pagination.current ?? 1) - 1, 0));
    };

    if (isLoading) {
        return <NotificationTemplateSkeleton />;
    }

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
                rowKey={(row) => row.id}
                columns={columns}
                dataSource={templates}
                loading={isFetching}
                pagination={{
                    current: page + 1,
                    pageSize: data?.size ?? 20,
                    total: data?.totalElements ?? templates.length,
                    showSizeChanger: true,
                    pageSizeOptions: [20, 30, 50],
                    showTotal: (total) => `Всего: ${total}`,
                }}
                onChange={handleTableChange}
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