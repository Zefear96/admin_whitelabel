import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import ButtonCreate from "../../../../../components/dataEntry/ButtonCreate";
import { useGetDocuments } from "../../../../../hooks/document-service/useGetDocuments";
import {
    DOCUMENT_STATUS_LABELS,
    DOCUMENT_TYPE_LABELS,
    type DocumentResponseType,
} from "../../../../../types/documentService/documentType";
import TableSkeleton from "../../../dictionary/TableSkeleton";
import CreateDocumentModal from "./CreateDocumentModal";
import DocumentDetailsModal from "./DocumentDetailsModal";

export default function DocumentsTab() {
    const { data, isLoading, error } = useGetDocuments();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<DocumentResponseType | null>(null);

    const columns: ColumnsType<DocumentResponseType> = [
        {
            title: "Тип",
            dataIndex: "type",
            render: (type: DocumentResponseType["type"]) => DOCUMENT_TYPE_LABELS[type] ?? type,
        },
        {
            title: "Версия",
            dataIndex: "version",
        },
        {
            title: "Файл",
            dataIndex: "fileName",
            render: (fileName: string, row) => (
                <a href={row.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                    {fileName}
                </a>
            ),
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (status: DocumentResponseType["status"]) => (
                <Tag color={status === "ACTIVE" ? "green" : "default"}>
                    {DOCUMENT_STATUS_LABELS[status] ?? status}
                </Tag>
            ),
        },
        {
            title: "Создан",
            dataIndex: "createdAt",
            render: (createdAt: string) => (createdAt ? dayjs(createdAt).format("DD.MM.YYYY HH:mm") : "—"),
        },
    ];

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <>
            <Card
                title="Документы"
                extra={<ButtonCreate title="Загрузить документ" onClick={() => setIsCreateModalOpen(true)} />}
            >
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table
                    rowKey="id"
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedRow(record);
                            setIsDetailsModalOpen(true);
                        },
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>
            <CreateDocumentModal isModalOpen={isCreateModalOpen} setIsModalOpen={setIsCreateModalOpen} />
            <DocumentDetailsModal
                isModalOpen={isDetailsModalOpen}
                setIsModalOpen={setIsDetailsModalOpen}
                data={selectedRow}
            />
        </>
    );
}
